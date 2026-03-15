# Firebase Hosting Deployment Guide

## Step 1: Create Firebase Project

1. Go to: **https://console.firebase.google.com**
2. Click **"Create a project"**
3. Enter project name: `iancredible-wappsite`
4. Accept terms and click **"Create project"**
5. Wait for setup to complete (~2-5 minutes)

---

## Step 2: Get Your Firebase Project ID

After creation:
1. Go to Project Settings (⚙️ icon → Project settings)
2. Copy your **Project ID** (e.g., `iancredible-wappsite-abc123`)
3. Keep this ready for the next step

---

## Step 3: Update .firebaserc File

Open `.firebaserc` and replace with:

```json
{
  "projects": {
    "default": "YOUR_PROJECT_ID"
  },
  "targets": {},
  "etags": {}
```

**Replace `YOUR_PROJECT_ID` with your actual Firebase Project ID** from Step 2.

---

## Step 4: Option A - Deploy as Static Site (Recommended for Quick Launch)

### Build static export:
```bash
cd "/Users/admin/Documents/AIAIAI/New iancredible site 2026"

# Export Next.js as static HTML
npm run export 2>/dev/null || npx next export
```

Then deploy:
```bash
firebase deploy --only hosting
```

✅ **Result**: Site live at `https://YOUR_PROJECT_ID.web.app`

---

## Step 5: Option B - Deploy Full Next.js App to Cloud Run (Advanced)

For full Next.js functionality with API routes:

### Enable Cloud Run API:

1. Go to: https://console.cloud.google.com/apis/library/run.googleapis.com
2. Click **"Enable"**
3. Select your Firebase project

### Create Dockerfile:

In root directory, create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY .next ./next
COPY public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

### Deploy to Cloud Run:

```bash
# Build Docker image
docker build -t gcr.io/YOUR_PROJECT_ID/iancredible-site .

# Push to Container Registry
docker push gcr.io/YOUR_PROJECT_ID/iancredible-site

# Deploy to Cloud Run
gcloud run deploy iancredible-site \
  --image gcr.io/YOUR_PROJECT_ID/iancredible-site \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

Then update `firebase.json` to point to Cloud Run:

```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "run": {
          "serviceId": "iancredible-site",
          "region": "us-central1"
        }
      }
    ]
  }
}
```

---

## My Recommendation: Go with Option A ✨

For the quickest launch with your current project:

1. Update `.firebaserc` with your Project ID ✓
2. Run: `firebase deploy --only hosting`
3. Your site goes live instantly! 🚀

The site is 99% static with interactive JS, so it works perfectly on Firebase Hosting.

---

## Troubleshooting

### "Permission denied" errors
```bash
# Re-authenticate
firebase logout
firebase login
```

### Can't find project
- Double-check `.firebaserc` has correct Project ID
- Verify you're logged into correct Google account

### Pages not loading
- Make sure `public/` folder has content
- Check Firebase Hosting console for errors: https://console.firebase.google.com/project/YOUR_PROJECT_ID/hosting/dashboard

---

## Post-Deployment

After going live at Firebase:

1. ✅ **Custom Domain** (optional):
   - Firebase console → Hosting → Domain → Add custom domain
   - Follow DNS instructions

2. ✅ **Enable HTTPS** (automatic)
   - Firebase Hosting provides SSL/TLS by default

3. ✅ **Monitor Traffic**:
   - Firebase Hosting dashboard shows real-time usage, errors, and performance

---

## Next Commands

```bash
# View deployment status
firebase hosting:channels:list

# View logs
firebase hosting:logs        # Real-time logs
firebase hosting:log --limit=10

# Deploy again (after code changes)
firebase deploy --only hosting

# Delete deployment
firebase hosting:disable
```

---

**Go live now!** 🎉
