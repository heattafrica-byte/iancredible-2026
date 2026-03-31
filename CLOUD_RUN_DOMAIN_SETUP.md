# iancredible.co.za Domain Setup Guide

## Current Status
✅ App deployed to Google Cloud Run  
✅ Cloud DNS API enabled  
🔄 Domain verification pending

## Live App URL
**https://iancredible-portfolio-796662323239.us-central1.run.app**

---

## Complete Domain Mapping Steps

### Option 1: Using Cloud Console (Recommended - 5 minutes)

1. **Go to Cloud Console:**
   - Navigate to: https://console.cloud.google.com/run/domains
   - Project: `iancredible-website`
   - Region: `us-central1`

2. **Add Domain Mapping:**
   - Click "Add Mapping"
   - Service: `iancredible-portfolio`
   - Domain: `iancredible.co.za`
   - Click "Continue"

3. **Update DNS Records:**
   Google will provide instructions. You'll need to add an **A record** or **CNAME record** at your domain registrar:
   
   - **If using A record:** Point to Google Cloud IP
   - **If using CNAME record:** Point to the Cloud Run service

4. **Verify Domain:**
   - Once DNS records propagate (5-30 minutes)
   - Google Cloud will auto-verify
   - Domain mapping completes

### Option 2: Using gcloud CLI

Once domain verification completes via Cloud Console:

```bash
gcloud beta run domain-mappings create \
  --service=iancredible-portfolio \
  --domain=iancredible.co.za \
  --region=us-central1
```

---

## DNS Requirements

### Via Cloud DNS (Already Enabled)
Nameservers provided by Google:
```
ns-123.googledomains.com
ns-456.googledomains.com
ns-789.googledomains.com
ns-000.googledomains.com
```

Update these at your registrar (where you manage `iancredible.co.za`)

### Via Direct A/CNAME Record
If keeping existing nameservers, add record pointing to Cloud Run

---

## Registrar Instructions
Update DNS at: `[Your domain registrar for iancredible.co.za]`

1. Log in to registrar dashboard
2. Find DNS settings for `iancredible.co.za`
3. Add the record(s) provided by Google Cloud Console
4. Save changes
5. Wait 5-30 minutes for propagation

---

## Verify Domain Working
Once DNS propagates:
```bash
curl https://iancredible.co.za
```

Should serve your Next.js app (same as the Cloud Run URL above)

---

## Troubleshooting

**"Domain not verified" error?**
- DNS records may not have propagated yet (wait 5-30 min)
- Check DNS record spelling at registrar
- Verify correct TLD (.co.za not .com)

**Domain shows old content?**
- Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
- Check that DNS records point to correct Cloud Run service

**HTTPS not working?**
- Google Cloud automatically provisions SSL certificate
- May take 5-10 minutes after domain maps
- Check in Cloud Console > Run > Domains for certificate status

---

## Service Configuration

| Item | Value |
|------|-------|
| Project | iancredible-website |
| Service | iancredible-portfolio |
| Region | us-central1 |
| Platform | Google Cloud Run (managed) |
| Custom Domain | iancredible.co.za |
| Runtime | Node.js (Next.js server) |
| Database | Firebase (Firestore) |
| Storage | Firebase Cloud Storage |
| Auth | Firebase Authentication |
| Payments | Paystack (webhooks enabled) |

---

## Environment Variables Set
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCqoKll_rAcRWJrO0SJ5pH7LK3-Ay_Juc8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=iancredible-website.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=iancredible-website
```

---

## Next Steps After Domain Maps
1. Update `NEXT_PUBLIC_SITE_URL` in `.env.local` to `https://iancredible.co.za`
2. Redeploy service: `gcloud run deploy iancredible-portfolio --source .`
3. Test payment webhooks at: `https://iancredible.co.za/api/webhooks/stripe`
4. Verify admin dashboard at: `https://iancredible.co.za/admin/dashboard`

---

## Support Resources
- Cloud Run Documentation: https://cloud.google.com/run/docs/mapping-custom-domains/
- Firebase Console: https://console.firebase.google.com/
- gcloud CLI Reference: https://cloud.google.com/sdk/gcloud/reference/run
