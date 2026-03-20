# Cosmic Flow - Unified Cloud Run Deployment Guide

> **Status**: Ready to Deploy | All components built and tested locally ✅

## Quick Start (Recommended)

The simplest way to deploy Cosmic Flow to Google Cloud Run:

```bash
# From project root
cd /Users/admin/Documents/AIAIAI/New\ iancredible\ site\ 2026

# Deploy to Cloud Run (gcloud handles everything)
gcloud run deploy cosmic-flow-server \
  --source ./app/cosmic-flow \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,GEMINI_API_KEY=$(cat app/cosmic-flow/.env.local | grep GEMINI_API_KEY | cut -d= -f2) \
  --port 3000 \
  --project iancredible-website
```

This command:
- ✅ Detects Dockerfile automatically
- ✅ Builds the image
- ✅ Pushes to Google Container Registry
- ✅ Deploys to Cloud Run
- ✅ Returns live service URL

**Expected output:**
```
Service URL: https://cosmic-flow-server-XXXXX-us-central1.a.run.app
```

---

## Step 1: Prerequisites

### Check gcloud CLI
```bash
gcloud --version
```

If not installed:
```bash
# macOS with Homebrew
brew install --cask google-cloud-sdk

# Or direct from Google (faster)
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

### Authenticate
```bash
# Login with your Google account
gcloud auth login

# Verify access to the Firebase project
gcloud projects list | grep iancredible-website

# Set as default
gcloud config set project iancredible-website
```

---

## Step 2: Deploy to Cloud Run

### Option A: One-Line Deployment (Recommended)

```bash
cd /Users/admin/Documents/AIAIAI/New\ iancredible\ site\ 2026
node deploy-cosmic-flow-unified.js
```

### Option B: Manual gcloud Command

```bash
# From project root
gcloud run deploy cosmic-flow-server \
  --source ./app/cosmic-flow \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars NODE_ENV=production \
  --memory 512Mi \
  --cpu 1 \
  --project iancredible-website
```

**Wait 2-5 minutes for deployment** (normal for first deployment)

### Option C: Using Docker (if you prefer)

```bash
cd app/cosmic-flow

# Build locally
docker build -t gcr.io/iancredible-website/cosmic-flow-server .

# Push to Google Container Registry
gcloud auth configure-docker
docker push gcr.io/iancredible-website/cosmic-flow-server

# Deploy from registry
gcloud run deploy cosmic-flow-server \
  --image gcr.io/iancredible-website/cosmic-flow-server \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --project iancredible-website
```

---

## Step 3: Get Your Service URL

After deployment, retrieve your Cloud Run service URL:

```bash
gcloud run services describe cosmic-flow-server \
  --region us-central1 \
  --format="value(status.url)"
```

Output example:
```
https://cosmic-flow-server-abc123-us-central1.a.run.app
```

---

## Step 4: Update Portfolio

Update your portfolio to use the new Cosmic Flow URL:

### Option A: Update Environment (Recommended)

```bash
# Edit .env.local in project root
NEXT_PUBLIC_COSMIC_FLOW_URL=https://cosmic-flow-server-abc123-us-central1.a.run.app
```

### Option B: Use Environment Setup Script

```bash
# Automatically update .env.local and .env.production
CLOUD_RUN_URL=$(gcloud run services describe cosmic-flow-server \
  --region us-central1 \
  --format="value(status.url)")

# Update environment files
sed -i '' "s|NEXT_PUBLIC_COSMIC_FLOW_URL=.*|NEXT_PUBLIC_COSMIC_FLOW_URL=$CLOUD_RUN_URL|g" .env.local
sed -i '' "s|NEXT_PUBLIC_COSMIC_FLOW_URL=.*|NEXT_PUBLIC_COSMIC_FLOW_URL=$CLOUD_RUN_URL|g" .env.production

echo "✅ Updated to: $CLOUD_RUN_URL"
```

---

## Step 5: Rebuild and Redeploy Portfolio

```bash
# Rebuild Next.js with new environment
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

---

## Monitoring & Troubleshooting

### View Logs
```bash
gcloud run logs read cosmic-flow-server --limit 50 --region us-central1
```

### Check Service Status
```bash
gcloud run describe cosmic-flow-server --region us-central1
```

### Test the Service
```bash
# Replace URL with your actual Cloud Run URL
curl https://cosmic-flow-server-XXXXX-us-central1.a.run.app/

# Output should show: "Connected to Cosmic Flow Backend"
```

### Troubleshooting Common Issues

**Error: "Permission denied"**
```bash
gcloud auth login
gcloud config set project iancredible-website
```

**Error: "Dockerfile not found"**
- Ensure you're in the project root directory
- Verify Dockerfile exists in `app/cosmic-flow/`

**Error: "Build failed"**
```bash
# View detailed build logs
gcloud builds log $(gcloud builds list --limit=1 --format='value(id)')
```

**Server crashes after deploy**
```bash
# Check logs for errors
gcloud run logs read cosmic-flow-server --region us-central1 --limit 100
```

---

## Performance Tips

- **Memory**: Start with 512 Mi (current), increase if needed
- **CPU**: 1 CPU sufficient for up to ~50 concurrent players
- **Connections**: Cloud Run supports ~1000 concurrent connections
- **Timeout**: Keep at 3600s for long WebSocket connections

Scale resources:
```bash
gcloud run deploy cosmic-flow-server \
  --memory 1Gi \
  --cpu 2 \
  --max-instances 10 \
  --region us-central1
```

---

## Environment Variables

### Available Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Set to `production` for Cloud Run | Yes |
| `GEMINI_API_KEY` | Gemini AI API key (optional) | No |
| `PORT` | Server port (default: 3000) | No |

### Setting Variables

```bash
gcloud run deploy cosmic-flow-server \
  --set-env-vars KEY1=value1,KEY2=value2 \
  --region us-central1
```

---

## Rollback & Recovery

### Rollback to Previous Deployment
```bash
# List revisions
gcloud run revisions list --service=cosmic-flow-server --region us-central1

# Switch to previous revision
gcloud run services update-traffic cosmic-flow-server \
  --to-revisions REVISION_ID=100 \
  --region us-central1
```

### Delete Service (if needed)
```bash
gcloud run services delete cosmic-flow-server --region us-central1
```

---

## Summary

✅ All components tested and working locally
✅ Dockerfile ready for Cloud Run
✅ Environment configured
✅ Ready for production deployment

**Next Step**: Run `gcloud run deploy cosmic-flow-server --source ./app/cosmic-flow ...` to go live!
