# Manual Domain Setup for iancredible.co.za

## ✅ Deployment Status
- **Cloud Run Service URL:** https://iancredible-portfolio-nqwjtlbcbq-uc.a.run.app
- **Service Name:** iancredible-portfolio
- **Region:** us-central1 (Google Cloud - Iowa)
- **Status:** ✅ LIVE and operational
- **Project:** iancredible-website

---

## 🎯 IMPORTANT: Update DNS Records at Your Registrar

The domain mapping is already created in Google Cloud! You just need to update your DNS records at your registrar (Namecheap, GoDaddy, etc.).

### Records to Update (Record Name = @ or blank for root domain):

**A Records (IPv4) — Record Name: `@` (root domain)**
- 216.239.32.21
- 216.239.34.21
- 216.239.36.21
- 216.239.38.21

**AAAA Records (IPv6) — Record Name: `@` (root domain)**
- 2001:4860:4802:32::15
- 2001:4860:4802:34::15
- 2001:4860:4802:36::15
- 2001:4860:4802:38::15

**Note:** The "Name" column in your registrar will show `@` or be blank — both refer to the root of `iancredible.co.za`

### Steps to Update:
1. Log into your domain registrar's control panel (Namecheap, GoDaddy, Afriregister, etc.)
2. Find **"Advanced DNS"** or **"DNS Records"** section
3. For each record in the table above:
   - **Name:** `@` (or leave blank — means root domain)
   - **Type:** A or AAAA (as shown)
   - **Data/Value:** Enter the IP from the table
   - **TTL:** 3600 (default is fine)
4. **Replace or add** all 8 records (4 A + 4 AAAA)
5. **Save changes**
6. Wait **5-30 minutes** for DNS propagation
7. Your domain will automatically point to your Cloud Run app ✅

### Verify Propagation:
```bash
nslookup iancredible.co.za
dig iancredible.co.za
```

Once nameservers propagate, your app will be live at `https://iancredible.co.za`

### Domain Mapping Status
✅ Domain mapping is already created in Google Cloud:
```bash
gcloud beta run domain-mappings create \
  --service=iancredible-portfolio \
  --domain=iancredible.co.za \
  --region=us-central1
```
(Command executed successfully with exit code 0)

---

## 🚀 Current Access
Your app is **immediately accessible** at:
- **Temporary URL:** https://iancredible-portfolio-nqwjtlbcbq-uc.a.run.app
- **Features:** All payment webhooks, admin dashboard, submissions, everything works

## ⏱️ Timeline
- **Nameserver Update:** Update at registrar now
- **DNS Propagation:** 5-30 minutes (usually faster)
- **Custom Domain Active:** `https://iancredible.co.za` live immediately after propagation

---

## 📋 Deployment Checklist
- ✅ Next.js app compiled (production build)
- ✅ Deployed to Cloud Run
- ✅ Paystack webhook handler implemented
- ✅ Firebase integration active
- ✅ Admin dashboard operational
- ✅ Payment processing live
- ✅ Domain mapping created in Google Cloud
- ⏳ Nameserver update at registrar (YOUR ACTION NEEDED)

---

## 🆘 Troubleshooting
If domain verification fails:
1. Ensure DNS records are correct (no typos in `_acme-challenge` prefix)
2. Wait full 30 minutes for DNS propagation before retrying
3. Check registrar DNS settings are updated
4. Use `nslookup` or `dig` to verify DNS record exists:
   ```bash
   nslookup _acme-challenge.iancredible.co.za
   dig _acme-challenge.iancredible.co.za
   ```

---

## 📞 Support Resources
- [Google Cloud Run Custom Domain Mapping](https://cloud.google.com/run/docs/mapping-custom-domains/)
- [Cloud Run FAQ - Custom Domains](https://cloud.google.com/run/docs/quickstarts/build-and-deploy)
