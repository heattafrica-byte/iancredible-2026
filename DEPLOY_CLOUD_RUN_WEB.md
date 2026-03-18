# Deploy Cosmic Flow to Cloud Run (Web Console)

Since we can't use the CLI, here's how to deploy through Google Cloud Console—no terminal commands needed!

## Prerequisites
- Your `service-account-key.json` file (already have this ✓)
- Browser access to Google Cloud Console
- ~5-10 minutes of your time

## Step 1: Prepare the Source Code

The source code is ready in your `app/cosmic-flow/` folder with:
- ✅ `Dockerfile` - Container configuration
- ✅ `server.ts` - Express + WebSocket server
- ✅ `package.json` - All dependencies

## Step 2: Upload Source to Cloud Source Repositories

1. Go to: **https://console.cloud.google.com/**
2. Select project: **`iancredible-website`**
3. Search for **"Cloud Source Repositories"** in the search bar
4. Click **"Create Repository"**
   - Name: `cosmic-flow-server`
   - Repository type: Keep as Cloud Source
   - Click **Create**

5. You'll see clone instructions. Instead:
   - Click the **"Manual push"** tab
   - Download `git-coding-source-repositories-helper.sh` script (shown on page)
   - Or use these commands in your terminal (from project root):

```bash
# Initialize git in cosmic-flow folder
cd app/cosmic-flow
git init
git config user.email "admin@example.com"
git config user.name "Admin"
git add .
git commit -m "Initial cosmic flow server"

# Add Cloud Source remote
git remote add google https://source.developers.google.com/p/iancredible-website/r/cosmic-flow-server

# Push to Cloud
git push google master
```

## Step 3: Deploy Using Cloud Build

1. Go to **Cloud Build** (search in console)
2. Click **Create Build** > **Cloud Source Repositories**
3. Select **cosmic-flow-server** repository
4. Choose branch: **master**
5. Build configuration:
   - Select: **Dockerfile**
   - Dockerfile location: Leave as `Dockerfile`
   - Images to build: `gcr.io/iancredible-website/cosmic-flow-server:latest`
6. Click **Create**

Wait for build to complete (shows green checkmark).

## Step 4: Deploy to Cloud Run

1. Go to **Cloud Run** (search in console)
2. Click **Create Service**
3. Configure:
   - **Service name:** `cosmic-flow-server`
   - **Region:** `us-central1`
   - **Container image URL:** Copy from Build (or manually enter: `gcr.io/iancredible-website/cosmic-flow-server:latest`)
   - **CPU allocated:** 1
   - **Memory:** 512 MB
   - **Maximum number of instances:** 100
   - **Timeout:** 3600 seconds
   
4. Under **Advanced settings**:
   - **Port:** 3000
   - Environment variables (optional):
     - `NODE_ENV` = `production`

5. **Authentication:** Select **"Allow unauthenticated invocations"**

6. Click **Create**

⏳ Wait 2-3 minutes for deployment to complete.

## Step 5: Get Your Cloud Run URL

Once deployed:
1. You'll see a **Service Details** page
2. Copy the **Service URL** (looks like `https://cosmic-flow-server-XXXXX-us-central1.a.run.app`)
3. This is your `NEXT_PUBLIC_COSMIC_FLOW_URL`

## Step 6: Update Your Portfolio

With your Cloud Run URL, update your portfolio:

**Option A: Via Environment Variable**
```bash
# Open .env.local and add:
NEXT_PUBLIC_COSMIC_FLOW_URL=https://cosmic-flow-server-XXXXX-us-central1.a.run.app
```

**Option B: Direct in Code** (if no env file)
- Update `app/components/CosmicFlowSection.tsx`
- Replace: `return 'https://cosmic-flow-server-XXXXX-us-central1.a.run.app'`

Then rebuild and deploy:
```bash
npm run build
firebase deploy --only hosting
```

## Verification

Once deployed:

1. **Test the server directly:**
   - Open your Cloud Run URL in browser
   - You should see the Cosmic Flow interface load

2. **Test the WebSocket:**
   - Open browser DevTools (F12)
   - Check Console tab
   - Open your portfolio's Cosmic Flow modal
   - You should see WebSocket connection establish (no errors)

3. **Monitor performance:**
   - Go to Cloud Run service
   - Tab: **Metrics**
   - See request count, latency, error rate

## Troubleshooting

### "Build failed"
- Check **Cloud Build** > **History**
- Click failed build to see error logs
- Likely issues:
  - Missing files in repo (verify all files pushed)
  - package.json dependencies (check `npm install` works locally)

### "Service won't start"
- Go to **Cloud Run** > **Logs** (bottom tab)
- Check error messages
- Common issues:
  - Wrong port (should be 3000)
  - Missing environment variables

### WebSocket connection fails
- Verify in browser console:
  - Should connect to your Cloud Run URL
  - Check CORS headers are correct
  - Ensure `--allow-unauthenticated` is enabled in Cloud Run settings

## Cost

- **Free tier:** 2 million requests/month, 360,000 compute seconds
- **Your usage:** Typically <100k requests/month = **free**
- **Monitor at:** Cloud Console > Billing > Overview

## Next Steps After Deployment

Once your server is running:

1. Share the Cloud Run URL with testers
2. Monitor metrics in Cloud Console
3. Update Cosmic Flow URL if you redeploy
4. Scale settings based on usage

---

**Questions?** Check the logs in Cloud Run service dashboard for detailed error messages.
