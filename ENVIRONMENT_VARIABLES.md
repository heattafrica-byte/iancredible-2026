# Environment Variables Setup Guide

## Overview
This document explains how to properly configure environment variables for the IANCREDIBLE Wappsite. **All environment variables are required** for the application to run.

---

## ⚠️ Security Notice

**NEVER commit `.env.local` or any file containing sensitive API keys to Git.**

The file `.gitignore` is configured to prevent this, but always verify:
```bash
# Check that .env.local is properly ignored
git status
# Should NOT show .env.local
```

---

## Main Application Environment Variables

Create a `.env.local` file in the project root with the following variables:

### Firebase Configuration

**Source**: [Firebase Console](https://console.firebase.google.com/)

```env
# Required: Firebase API Key
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here

# Required: Firebase Authentication Domain
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com

# Required: Firebase Project ID
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here

# Required: Firebase Storage Bucket
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com

# Required: Firebase Messaging Sender ID
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here

# Required: Firebase App ID
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

**How to get Firebase credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click on your project (iancredible-website)
3. Go to Settings ⚙️ → Project Settings
4. Under "Your apps" → Find your web app
5. Copy all credentials

### Paystack Configuration

**Source**: [Paystack Dashboard](https://dashboard.paystack.com/settings/developer)

```env
# Required: Paystack Secret Key (for server-side operations)
# Use sk_test_... for testing, sk_live_... for production
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here

# Required: Paystack Webhook Secret
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret_here
```

**How to get Paystack credentials:**
1. Log in to [Paystack Dashboard](https://dashboard.paystack.com/)
2. Go to Settings → Developer → API Keys & Webhooks
3. Copy your test or live secret key

### Cosmic Flow Configuration

```env
# Required: Cosmic Flow Backend URL (after deploying to Cloud Run)
NEXT_PUBLIC_COSMIC_FLOW_URL=https://cosmic-flow-PROJECT_ID-us-central1.run.app
```

**How to set this:**
- Complete deployment steps in `DEPLOYMENT_COSMIC_FLOW.md`
- Copy the Cloud Run service URL
- Replace the placeholder with actual URL

### Site Configuration

```env
# Optional: Site URL for external linking
NEXT_PUBLIC_SITE_URL=http://localhost:3001

# Optional: Site Name
NEXT_PUBLIC_SITE_NAME=IANCREDIBLE Wappsite

# Optional: Application Version
NEXT_PUBLIC_APP_VERSION=1.0.0

# Optional: Google Analytics Tracking ID
NEXT_PUBLIC_GA_TRACKING_ID=G_XXXXXXXX
```

### Node Environment

```env
# Deployment environment
NODE_ENV=production
```

---

## Cosmic Flow Micro-frontend Environment Variables

Location: `app/cosmic-flow/.env.local`

```env
# Required: Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Required: Application URL (automatically injected in Google AI Studio)
APP_URL=http://localhost:3000

# Development mode
NODE_ENV=development
```

---

## Development Setup (Step by Step)

### 1. Copy Template File
```bash
cp .env.example .env.local
```

### 2. Get Firebase Credentials
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select iancredible-website project
3. Settings → Project Settings
4. Copy all credentials values
5. Paste into `.env.local`

### 3. Get Paystack Credentials (if using payments)
1. Open [Paystack Dashboard](https://dashboard.paystack.com/settings/developer)
2. Copy test Secret Key
3. Paste into `.env.local` as `PAYSTACK_SECRET_KEY`

### 4. Verify Setup
```bash
# Test that environment variables are loaded
npm run dev

# Check browser console for Firebase initialization
# Should NOT show errors about missing credentials
```

---

## Production Deployment

When deploying to production platforms:

### Vercel
1. Go to Project Settings → Environment Variables
2. Add each variable from `.env.local`
3. Select environment(s): Production, Preview, Development as needed
4. Re-deploy project

### Firebase Hosting
1. Create `.env.production` with production values
2. Deploy via Firebase CLI:
   ```bash
   firebase deploy
   ```

### Cloud Run
1. Create `.env.production.local`
2. Deploy via Cloud Run:
   ```bash
   gcloud run deploy iancredible --env-vars-file=.env.production.local
   ```

### Docker/Traditional Hosting
```bash
# Build with environment variables
docker build --build-arg NODE_ENV=production \
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY=$FIREBASE_KEY \
  -t iancredible-wappsite .

# Run with environment variables
docker run -e NEXT_PUBLIC_FIREBASE_API_KEY=$FIREBASE_KEY \
  -p 3000:3000 iancredible-wappsite
```

---

## Verification Checklist

- [ ] `.env.local` file created in project root
- [ ] All required Firebase variables populated
- [ ] Paystack credentials added (if using payments)
- [ ] `npm run dev` runs without credential errors
- [ ] No sensitive keys visible in browser console
- [ ] `.env.local` is in `.gitignore` (not committed)
- [ ] Production credentials are NOT in development `.env.local`

---

## Troubleshooting

### Error: "Missing required environment variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID"
✅ **Solution**: Add all Firebase credentials to `.env.local`

### Firebase functions not accessible
✅ **Solution**: Ensure `NEXT_PUBLIC_FIREBASE_API_KEY` is correct and matches your Firebase project

### Paystack payments failing
✅ **Solution**: Verify `PAYSTACK_SECRET_KEY` matches your Paystack account (test vs. live)

### Cosmic Flow not connecting
✅ **Solution**: Ensure `NEXT_PUBLIC_COSMIC_FLOW_URL` points to your deployed Cloud Run service

---

## Security Best Practices

1. ✅ **Never share `.env.local`** - each developer gets their own
2. ✅ **Never commit credentials** - use `.gitignore`
3. ✅ **Rotate keys regularly** - especially in production
4. ✅ **Use test keys for development** - switch to live keys only for production
5. ✅ **Audit Firebase rules** - ensure proper access control
6. ✅ **Monitor API usage** - watch for unauthorized access

---

## Related Documentation

- [Firebase Setup Guide](./FIREBASE_HOSTING_SETUP.md)
- [Paystack Integration Guide](./PAYSTACK_SETUP_GUIDE.md)
- [Cosmic Flow Deployment](./DEPLOYMENT_COSMIC_FLOW.md)
- [Production Deployment](./PRODUCTION_README.md)
