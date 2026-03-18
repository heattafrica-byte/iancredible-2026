# Cosmic Flow - Cloud Run Deployment Guide

## Status: ✅ Server Running Locally

Your cosmic-flow server is currently running on `http://localhost:3000` with WebSocket support.

---

## Option 1: Automated Deployment (Recommended)

### Prerequisites
- Google Cloud Account with billing enabled
- Firebase project already set up (`iancredible-website`)
- Docker Desktop installed
- gcloud CLI installed

### One-Command Deployment

```bash
# Navigate to project root
cd ~/Documents/AIAIAI/New\ iancredible\ site\ 2026

# Run deployment script
bash deploy-cosmic-flow-to-cloud-run.sh
```

The script will:
1. ✅ Verify prerequisites
2. ✅ Authenticate with Google Cloud
3. ✅ Build Docker image
4. ✅ Push to Google Container Registry
5. ✅ Deploy to Cloud Run
6. ✅ Provide live URL and next steps

---

## Option 2: Manual Deployment Steps

### Step 1: Install gcloud CLI

**macOS:**
```bash
# Using Homebrew (slow, ~5-10 minutes)
brew install --cask google-cloud-sdk

# OR Direct from Google (faster, ~2-3 minutes)
curl https://sdk.cloud.google.com | bash
# Follow prompts, accept defaults
exec -l $SHELL  # Reload shell
```

**Verify installation:**
```bash
gcloud --version
```

### Step 2: Initialize gcloud

```bash
# Authenticate with Google
gcloud auth login

# Set default project
gcloud config set project iancredible-website

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### Step 3: Build Docker Image

#### Option A: Local Docker Build

```bash
cd app/cosmic-flow

# Build image
docker build -t gcr.io/iancredible-website/cosmic-flow-server .

# Tag for Google Container Registry
docker tag gcr.io/iancredible-website/cosmic-flow-server gcr.io/iancredible-website/cosmic-flow-server:latest
```

#### Option B: Cloud Build (No Docker Required)

```bash
cd app/cosmic-flow

# Submit to Cloud Build
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_PROJECT_ID=iancredible-website
```

### Step 4: Push Image to Google Container Registry

If using local Docker:
```bash
# Configure Docker authentication
gcloud auth configure-docker

# Push image
docker push gcr.io/iancredible-website/cosmic-flow-server
```

### Step 5: Deploy to Cloud Run

```bash
gcloud run deploy cosmic-flow-server \
  --image gcr.io/iancredible-website/cosmic-flow-server \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars NODE_ENV=production \
  --memory 512Mi \
  --cpu 1 \
  --timeout 3600s
```

**Parameters explained:**
- `--platform managed` - Fully managed Cloud Run (no VPC setup needed)
- `--region us-central1` - Deploy to US Central region
- `--allow-unauthenticated` - Allow public access (for multiplayer gaming)
- `--port 3000` - Express server runs on port 3000
- `--memory 512Mi` - RAM allocation (adequate for Node.js server)
- `--cpu 1` - CPU allocation
- `--timeout 3600s` - Max request timeout (1 hour for long connections)

### Step 6: Get Your Live URL

```bash
gcloud run services describe cosmic-flow-server \
  --region us-central1 \
  --format="value(status.url)"
```

Output will be: `https://cosmic-flow-server-XXXXX-us-central1.a.run.app`

---

## Step 7: Update Your Environment

Edit `.env.local` in project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCqoKll_rAcRWJrO0SJ5pH7LK3-Ay_Juc8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=iancredible-website.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=iancredible-website
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=iancredible-website.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=796662323239
NEXT_PUBLIC_FIREBASE_APP_ID=1:796662323239:web:4e7c185a08c0918f941602

# Cosmic Flow Server
NEXT_PUBLIC_COSMIC_FLOW_URL=https://cosmic-flow-server-XXXXX-us-central1.a.run.app

# Deployment Settings
NEXT_PUBLIC_SITE_URL=https://iancredible-website.vercel.app
NODE_ENV=production
```

Replace `XXXXX` with your actual service ID.

---

## Step 8: Redeploy Next.js App

```bash
# Rebuild Next.js app with new environment
npm run build

# Deploy to Vercel/Netlify or your hosting
vercel deploy
```

---

## Monitoring & Logs

### View Real-time Logs
```bash
gcloud run logs read cosmic-flow-server --region us-central1 --follow
```

### Check Service Status
```bash
gcloud run services describe cosmic-flow-server --region us-central1
```

### Monitor Metrics
- Visit: `https://console.cloud.google.com/run`
- Select `cosmic-flow-server`
- View metrics: requests, latency, errors

---

## Scaling & Cost Management

### Auto-scaling Configuration
Cloud Run automatically scales from 0 to configured maximum:

```bash
gcloud run services update cosmic-flow-server \
  --region us-central1 \
  --min-instances 0 \
  --max-instances 10
```

- `min-instances 0` - Coldstart when idle (saves cost)
- `max-instances 10` - Prevent runaway scaling

### Cost Estimate (Monthly)
- 2M requests: ~$10-15/month
- Always-on 1 instance: ~$15-20/month
- No traffic: ~$1-2/month (minimum)

---

## Troubleshooting

### Port Already in Use (Local)
```bash
lsof -ti:3000 | xargs kill -9
```

### Image Not Found
```bash
# Check image in registry
gcloud container images list --repository=gcr.io/iancredible-website

# List all images
docker images
```

### Service Won't Start
```bash
# View recent logs
gcloud run logs read cosmic-flow-server --limit 50
```

### WebSocket Connection Issues
- Ensure `--allow-unauthenticated` flag is set
- Check CORS if frontend is on different domain
- Verify Cloud Run ingress is set to "All traffic"

---

## Next: Frontend Integration

Once deployed, the Cosmic Flow component in your Next.js app will connect:

```typescript
// In your Next.js app
const COSMIC_FLOW_URL = process.env.NEXT_PUBLIC_COSMIC_FLOW_URL;
// Example: https://cosmic-flow-server-xxxxx-us-central1.a.run.app

// WebSocket connection
const ws = new WebSocket(`${COSMIC_FLOW_URL.replace('https', 'wss')}`);
```

---

## Support

For issues or questions:
- 📚 [Cloud Run Documentation](https://cloud.google.com/run/docs)
- 🐛 [View Logs](https://console.cloud.google.com/logs)
- 🔧 [Cloud Run Console](https://console.cloud.google.com/run)
