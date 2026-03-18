# Quick Cloud Run Deployment Guide

Everything is prepared and ready! Just need one tool...

## What's Already Done ✓
- ✓ Dockerfile created for Cosmic Flow
- ✓ .dockerignore configured  
- ✓ server.ts updated for Cloud Run
- ✓ CosmicFlowSection.tsx configured for dynamic URLs
- ✓ .env.example updated with COSMIC_FLOW_URL variable
- ✓ Deploy script created (deploy.js)

## One-Step Deployment (if you have gcloud CLI)

```bash
# Option 1: Automated (requires gcloud installed)
node deploy.js

# That's it! The script will:
# 1. Deploy Cosmic Flow to Cloud Run
# 2. Get the service URL
# 3. Update .env.production
# 4. Rebuild the portfolio
# 5. Deploy to Firebase
```

## Manual Deployment (if gcloud isn't installed)

### Step 1: Install Google Cloud SDK
```bash
# Option A: Homebrew (recommended)
brew install google-cloud-sdk

# Option B: Direct from Google
# 1. Visit: https://cloud.google.com/sdk/docs/install
# 2. Download for macOS
# 3. Follow installation instructions
```

### Step 2: Authenticate
```bash
# Initialize gcloud with your account
gcloud auth login

# Or use service account (for CI/CD)
gcloud auth activate-service-account --key-file=./service-account-key.json
```

### Step 3: Deploy Cosmic Flow
```bash
# From the project root:
gcloud run deploy cosmic-flow-server \
  --source ./app/cosmic-flow \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production \
  --port 3000 \
  --project iancredible-website
```

This command will:
- Build the Dockerfile automatically
- Push to Container Registry
- Deploy to Cloud Run
- Output the service URL (like: `https://cosmic-flow-server-XXXXX.run.app`)

### Step 4: Configure Portfolio
```bash
# Copy the service URL from Step 3, then:

# Create/update .env.production
echo "NEXT_PUBLIC_COSMIC_FLOW_URL=https://cosmic-flow-server-XXXXX.run.app" > .env.production

# Rebuild portfolio
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

## Expected Output

After deployment, you should see:
```
Service URL: https://cosmic-flow-server-abc123def-us-central1.a.run.app

✓ DEPLOYMENT COMPLETE!

Cosmic Flow Backend: https://cosmic-flow-server-abc123def-us-central1.a.run.app
Portfolio: https://iancredible-website.web.app
```

## Testing

1. Visit: https://iancredible-website.web.app
2. Scroll to "COSMIC FLOW" section
3. Click "ENTER COSMIC FLOW →"
4. You should see the collaborative particle experience load

If you see WebSocket errors, check:
- Cloud Run service is running: `gcloud run describe cosmic-flow-server`
- Service allows unauthenticated access
- Browser DevTools Network tab shows WebSocket connecting to your Cloud Run URL

## Time Estimate

- gcloud install: 5-10 minutes
- Cosmic Flow deployment: 2-5 minutes
- Portfolio rebuild & deploy: 3-5 minutes
- **Total: 10-20 minutes**

## Troubleshooting

### "gcloud command not found"
- Restart your terminal after installation
- Run: `source ~/.bashrc` (if using bash)
- Or: `source ~/.zshrc` (if using zsh)

### "Permission denied" errors
- Make sure you authenticated: `gcloud auth login`
- Verify project set: `gcloud config set project iancredible-website`

### Cloud Run service won't deploy
- Check Docker is working: `docker build -t test ./app/cosmic-flow`
- Verify files: `ls -la app/cosmic-flow/Dockerfile`
- Check logs: `gcloud run logs read cosmic-flow-server`

### WebSocket connection fails in browser
- Verify Cloud Run URL is correct in browser DevTools
- Check service allows unauthenticated: `gcloud run describe cosmic-flow-server --region us-central1`
- Ensure `--allow-unauthenticated` flag was used in deployment

## What to Do Next

1. **If you have gcloud**: Just run `node deploy.js` from root
2. **If you don't**: Follow the manual steps above
3. **After deployment**: Hard refresh browser (Cmd+Shift+R) to test

That's it! Your Cosmic Flow collaborative experience  will be live! 🚀
