
import express from 'express';
import { createServer as createViteServer } from 'vite';
import Stripe from 'stripe';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';
import os from 'os';

dotenv.config();

// Set fluent-ffmpeg to use the static binary
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

const upload = multer({ 
  dest: os.tmpdir(),
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB limit
});

// Note: In a real production environment, you would use a service account key
// For this environment, we assume Firebase is configured via environment variables
// or we use the client-side SDK's ability to interact with the database if possible.
// However, for a secure webhook, we need admin access.
// If FIREBASE_SERVICE_ACCOUNT is not provided, we will log a warning.

const app = express();
const PORT = process.env.PORT || 3000;

let stripeClient: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    stripeClient = new Stripe(key, {
      apiVersion: '2025-01-27.acacia' as any,
    });
  }
  return stripeClient;
}

async function startServer() {
  // Stripe Webhook needs raw body
  app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      const stripe = getStripe();
      event = stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;

      if (userId) {
        console.log(`Payment successful for user: ${userId}`);
        // Here you would update the user's isPro status in Firestore
        // This requires firebase-admin setup
      }
    }

    res.json({ received: true });
  });

  app.use(cors());
  app.use(bodyParser.json({ limit: '500mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));

  // API Routes
  const chunkDir = path.join(os.tmpdir(), 'chunks');
  if (!fs.existsSync(chunkDir)) fs.mkdirSync(chunkDir);

  app.post('/api/upload-chunk', upload.single('chunk'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No chunk provided' });
    const { uploadId, chunkIndex } = req.body;
    const chunkPath = path.join(chunkDir, `${uploadId}_${chunkIndex}`);
    fs.renameSync(req.file.path, chunkPath);
    res.json({ success: true });
  });

  app.post('/api/encode-flac-chunked', async (req, res) => {
    const { uploadId, totalChunks, filename, applyMastering } = req.body;
    const inputPath = path.join(os.tmpdir(), `${uploadId}.wav`);
    const outputPath = path.join(os.tmpdir(), `${uploadId}.flac`);
    
    try {
      const writeStream = fs.createWriteStream(inputPath);
      for (let i = 0; i < parseInt(totalChunks); i++) {
        const chunkPath = path.join(chunkDir, `${uploadId}_${i}`);
        if (fs.existsSync(chunkPath)) {
          const data = fs.readFileSync(chunkPath);
          writeStream.write(data);
          fs.unlinkSync(chunkPath);
        }
      }
      writeStream.end();

      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });

      if (applyMastering === 'true') {
        const auphonicKey = process.env.AUPHONIC_API_KEY;
        if (auphonicKey) {
          console.log("Starting Auphonic AI Mastering...");
          const FormData = (await import('form-data')).default;
          const axios = (await import('axios')).default;

          const form = new FormData();
          form.append('input_file', fs.createReadStream(inputPath));
          form.append('action', 'start');
          form.append('algorithms', JSON.stringify({
            leveler: true,
            norm_lufs: -14,
            denoise: true,
            highpass: true
          }));
          form.append('output_files', JSON.stringify([
            { format: 'flac', bitrate: 'lossless' }
          ]));

          const createRes = await axios.post('https://auphonic.com/api/productions.json', form, {
            headers: {
              ...form.getHeaders(),
              'Authorization': `Bearer ${auphonicKey}`
            }
          });

          const uuid = createRes.data.data.uuid;
          console.log(`Auphonic Production created: ${uuid}`);

          let isDone = false;
          let downloadUrl = '';
          while (!isDone) {
            await new Promise(r => setTimeout(r, 5000));
            const statusRes = await axios.get(`https://auphonic.com/api/productions/${uuid}.json`, {
              headers: { 'Authorization': `Bearer ${auphonicKey}` }
            });
            const status = statusRes.data.data.status_string;
            console.log(`Auphonic Status: ${status}`);
            if (status === 'Done') {
              isDone = true;
              downloadUrl = statusRes.data.data.output_files[0].download_url;
            } else if (status === 'Error' || status === 'Failed') {
              throw new Error("Auphonic processing failed.");
            }
          }

          const fileRes = await axios.get(downloadUrl, { responseType: 'stream' });
          const outStream = fs.createWriteStream(outputPath);
          fileRes.data.pipe(outStream);

          await new Promise((resolve, reject) => {
            outStream.on('finish', resolve);
            outStream.on('error', reject);
          });

          res.download(outputPath, filename || 'IntelliMix_Mastered.flac', () => {
            fs.unlink(inputPath, () => {});
            fs.unlink(outputPath, () => {});
          });
          return;
        } else {
          console.log("No Auphonic key found, falling back to FFmpeg mastering.");
          await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
              .audioFilters([
                'highpass=f=20',
                'anequalizer=c0 f=300 w=100 g=-1.5 t=1|c1 f=300 w=100 g=-1.5 t=1|c0 f=5000 w=2000 g=2 t=1|c1 f=5000 w=2000 g=2 t=1',
                'acompressor=threshold=-15dB:ratio=2.5:attack=5:release=50:makeup=2',
                'loudnorm=I=-14:LRA=11:TP=-1.0'
              ])
              .outputOptions(['-c:a flac', '-compression_level 8'])
              .save(outputPath)
              .on('end', resolve)
              .on('error', reject);
          });
          res.download(outputPath, filename || 'IntelliMix_Mastered.flac', () => {
            fs.unlink(inputPath, () => {});
            fs.unlink(outputPath, () => {});
          });
          return;
        }
      } else {
        await new Promise((resolve, reject) => {
          ffmpeg(inputPath)
            .outputOptions(['-c:a flac', '-compression_level 8'])
            .save(outputPath)
            .on('end', resolve)
            .on('error', reject);
        });
        res.download(outputPath, filename || 'IntelliMix_Output.flac', () => {
          fs.unlink(inputPath, () => {});
          fs.unlink(outputPath, () => {});
        });
        return;
      }
    } catch (err) {
      console.error('Processing error:', err);
      res.status(500).json({ error: 'Failed to process audio' });
    }
  });

  app.post('/api/encode-flac', upload.single('audio'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const inputPath = req.file.path;
    const outputPath = path.join(os.tmpdir(), `${req.file.filename}.flac`);
    const applyMastering = req.body.applyMastering === 'true';

    let command = ffmpeg(inputPath);

    if (applyMastering) {
      command = command.audioFilters([
        'highpass=f=20', // 1. Remove sub-sonic rumble
        'anequalizer=c0 f=300 w=100 g=-1.5 t=1|c1 f=300 w=100 g=-1.5 t=1|c0 f=5000 w=2000 g=2 t=1|c1 f=5000 w=2000 g=2 t=1', // 2. Gentle EQ: cut mud at 300Hz, boost air at 5kHz
        'acompressor=threshold=-15dB:ratio=2.5:attack=5:release=50:makeup=2', // 3. Glue compression to tighten the mix
        'loudnorm=I=-14:LRA=11:TP=-1.0' // 4. Master to Spotify/Apple Music streaming loudness standards (-14 LUFS)
      ]);
    }

    command
      .outputOptions([
        '-c:a flac', // Use FLAC codec
        '-compression_level 8' // Maximum compression (smallest file, highest quality lossless)
      ])
      .save(outputPath)
      .on('end', () => {
        res.download(outputPath, 'IntelliMix_Output_24bit_48kHz.flac', (err) => {
          // Cleanup temp files after download
          fs.unlink(inputPath, () => {});
          fs.unlink(outputPath, () => {});
        });
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        res.status(500).json({ error: 'Failed to encode FLAC' });
        // Cleanup temp file on error
        fs.unlink(inputPath, () => {});
      });
  });

  app.post('/api/create-checkout-session', async (req, res) => {
    const { userId, userEmail } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'IntelliMix AI Pro',
                description: 'Unlimited stems, high-res exports, and advanced AI engineering.',
              },
              unit_amount: 1499, // $14.99
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.APP_URL || 'http://localhost:3000'}/?payment=success`,
        cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/?payment=cancel`,
        client_reference_id: userId,
        customer_email: userEmail,
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error('Stripe error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*all', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
