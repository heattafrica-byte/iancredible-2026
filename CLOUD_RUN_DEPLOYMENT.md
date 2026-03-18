# Deploying Cosmic Flow Backend to Cloud Run

This guide explains how to deploy the Cosmic Flow Express/WebSocket server to Google Cloud Run.

## Prerequisites

1. **Google Cloud Project** - The same one used for Firebase (`iancredible-website`)
2. **gcloud CLI** - Install from https://cloud.google.com/sdk/docs/install
3. **Docker** - Install from https://www.docker.com/products/docker-desktop
4. **Authenticated gcloud** - Run `gcloud auth login`

## Deployment Steps

### 1. Build and Deploy to Cloud Run

From the workshop root (not inside cosmic-flow), run:

```bash
# Set your project ID (replace with your actual ID)
PROJECT_ID="iancredible-website"
REGION="us-central1"  # or your preferred region

# Navigate to cosmic-flow directory
cd app/cosmic-flow

# Deploy to Cloud Run
gcloud run deploy cosmic-flow-server \
  --source . \
  --platform managed \
  --region $REGION \
  --project $PROJECT_ID \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production \
  --port 3000
```

### 2. Get Your Cloud Run URL

After deployment completes, you'll get a URL like:
```
https://cosmic-flow-server-XXXXXXXX-us-central1.a.run.app
```

### 3. Update Your Portfolio

Update the `NEXT_PUBLIC_COSMIC_FLOW_URL` in your `.env.production` file:

```bash
NEXT_PUBLIC_COSMIC_FLOW_URL=https://cosmic-flow-server-XXXXXXXX-us-central1.a.run.app
```

### 4. Rebuild and Redeploy Portfolio

```bash
# Back in the root directory
cd ../../

# Rebuild Next.js
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## Testing Locally

To test the server locally before deploying:

```bash
cd app/cosmic-flow

# Install dependencies (if not already done)
npm install

# Run in dev mode
npm run dev

# The server will start at http://localhost:3000
```

Then update `CosmicFlowSection.tsx` to point to `http://localhost:3000` while testing locally.

## Monitoring

You can monitor your Cloud Run service:

```bash
# View logs
gcloud run logs read cosmic-flow-server --limit 50

# View metrics
gcloud run describe cosmic-flow-server --region us-central1 --platform managed
```

## Environment Variables (Optional)

If you need to configure additional environment variables:

```bash
gcloud run deploy cosmic-flow-server \
  --source . \
  --set-env-vars \
    NODE_ENV=production,\
    LOG_LEVEL=info
```

## Cost Considerations

- Cloud Run pricing: You get 2 million requests per month free
- WebSocket connections count as requests
- Minimal cost for typical usage patterns
- You can set auto-scaling limits to control costs

## Troubleshooting

### Connection Refused
- Make sure the Cloud Run URL is correct
- Check that `--allow-unauthenticated` flag is set
- Verify the service is running: `gcloud run describe cosmic-flow-server --region us-central1`

### WebSocket Connection Fails
- Check browser console for the exact error
- Verify CORS/security settings if needed
- Ensure `--allow-unauthenticated` is enabled

### Service Won't Deploy
- Check Docker builds locally: `docker build -t cosmic-flow-test .`
- Verify all dependencies in package.json are available
- Check gcloud quota limits: `gcloud compute project-info describe`

## Architecture

```
[Portfolio (Firebase Hosting)] 
           ↓ (iframe)
    [Cloud Run Service]
           ↓ (WebSocket)
    [Connected Clients]
```

The portfolio serves a static iframe that connects to the Cloud Run service for real-time collaboration.
