# Next Steps - Paystack Account & Configuration

## Timeline: Start Here ⬇️

Congratulations! The code migration to Paystack is complete. Here's what needs to happen next to get payments working:

---

## 🎯 Immediate Actions (Today/This Week)

### 1. Create Paystack Business Account

**Time: 5 minutes**

1. Go to https://paystack.com
2. Click **Sign Up** (top right)
3. Select **Business** option
4. Fill in:
   - Business name
   - Email address
   - Phone number
   - Password
5. Verify email (check inbox)
6. You'll be in **test mode** automatically

✅ **You now have Test API Keys ready!**

---

### 2. Get Your Test API Keys

**Time: 2 minutes**

1. Login to https://dashboard.paystack.com
2. Left sidebar → **Settings**
3. Click **API Keys & Webhooks**
4. You'll see two sections:
   - **Test Keys** (currently active)
   - **Live Keys** (after verification)

**Copy these values:**
- Find: `sk_test_...` (Secret Key)
- Find: The **Webhook Secret** below the webhook URL input

5. Add to your `.env.local` file:
```env
PAYSTACK_SECRET_KEY=sk_test_xxxxx (paste the test secret key)
PAYSTACK_WEBHOOK_SECRET=xxxxx (paste the webhook secret)
```

✅ **You can now test payments locally!**

---

### 3. Test Payment Flow Locally

**Time: 15 minutes**

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Navigate to: http://localhost:3000/submit/track

3. Fill the form:
   - Track Title: "Test Track"
   - Artist Name: "Test Artist"
   - **Email**: Use a real email (required!)
   - Audio File: Upload any MP3

4. Click: **"Submit Track & Pay R100 (Paystack)"**

5. You should see Paystack checkout page

6. Use test card:
   - Number: `4084084084084081`
   - Expiry: `01/25` (or any future date)
   - CVV: `408`
   - Click **Pay**

7. You should be redirected back to your app

**Check these locations:**
- ✅ Firebase Firestore > `submissions` collection - new record?
- ✅ Firebase Firestore > `payments` collection - payment record?
- ✅ http://localhost:3000/admin (if logged in as admin) - see payment?

✅ **If all checks pass, local testing works!**

---

## 📝 Short Term (This Month)

### 4. Complete Paystack Verification for Live Keys

**Time: 1-2 days**

To get **Live API Keys** (for real money), Paystack requires verification:

1. Dashboard → **Settings** → **Business**
2. Fill out:
   - Business Details
   - Director/Owner Information
   - Bank Account Details
   - Tax Information (if applicable)
   - URL of your website

3. Upload:
   - Business Registration
   - ID/Passport (director)
   - Proof of Address
   - Bank Statement (optional but helps)

4. Submit for review
   - Paystack South Africa team reviews (typically 1-3 business days)
   - Check email for approval

⚠️ **Note**: In test mode you have unlimited free transactions. You need live keys only when accepting real money.

---

### 5. Configure Webhook URL

**Time: 5 minutes**

Once verified (or even before with test keys):

1. Dashboard → **Settings** → **API Keys & Webhooks**
2. Find **Webhook Configuration** section
3. In the URL field, enter:
   ```
   https://yourdomain.com/api/webhooks/stripe
   ```
   *(Note: yes, it says 'stripe' - that's the endpoint path)*

4. Events to subscribe (check these):
   - [x] `charge.success` - ✅ Select this
   - [x] `charge.failed` - ✅ Select this
   - Optional: subscription events

5. Click **Save**

6. **Test webhook** button (sends test event):
   - Click "Send test event"
   - Your app should receive it
   - Check your app logs

✅ **Webhook configured!**

---

### 6. Set Up Bank Account for Settlements

**Time: 10 minutes**

This is how Paystack pays you:

1. Dashboard → **Payouts** (left sidebar)
2. Click **Add Bank Account**
3. Fill in:
   - Bank name (select from list)
   - Account number
   - Account type (Cheque/Savings)
   - Account holder name
   - Branch code (if required)

4. Paystack will do a verification:
   - They'll debit a small amount (~R0.50-R1)
   - Then credit it back
   - This confirms the account is valid

5. Once verified:
   - Paystack will settle payments daily
   - Money goes to your account overnight typically

✅ **Bank account configured!**

---

## 🚀 Production Deployment (When Ready)

### 7. Get Live API Keys

**Prerequisite**: Must be verified (step 4)

1. Dashboard → **Settings** → **API Keys & Webhooks**
2. Switch from **Test Keys** tab to **Live Keys** tab
3. Copy:
   - `sk_live_...` (Secret Key)
   - Live Webhook Secret

---

### 8. Update Production Environment Variables

**Where**: Your hosting platform (Vercel, Firebase, etc.)

**For Vercel:**
1. Project Settings → Environment Variables
2. Add:
   ```
   PAYSTACK_SECRET_KEY = sk_live_xxxxx
   PAYSTACK_WEBHOOK_SECRET = xxxxx
   ```
3. Deploy

**For Firebase Hosting:**
```bash
firebase functions:config:set paystack.secret_key="sk_live_..." paystack.webhook="..." 
firebase deploy
```

---

### 9. Update Webhook URL in Paystack

**Important**: For production, webhook must be HTTPS:

1. Dashboard → Settings → API Keys & Webhooks
2. Update webhook URL to production domain:
   ```
   https://yourdomain.com/api/webhooks/stripe
   ```
3. Save
4. Click "Send test event" to verify

✅ **Production ready!**

---

## 📊 Monitoring & Maintenance

### Daily Checks (After Go-Live)

1. **Paystack Dashboard**
   - Transactions page - any failures?
   - Recent payments - amounts correct?

2. **Your Admin Panel**
   - Payments page - sync with Paystack?
   - Any payment status mismatches?

3. **Bank Account**
   - Settlement received?
   - Amount matches Paystack?

### Weekly Checks

1. Run reconciliation:
   - Count: Paystack transactions
   - Count: Your app `payments` collection
   - Should match

2. Check settled amounts:
   - Total from week in Paystack
   - Should equal bank deposits (minus fees)

### Monthly Checks

1. Review settlement summary
2. Check for duplicate payments
3. Verify fee calculations
4. Update documentation if needed

---

## ❓ Troubleshooting During Setup

### "I'm not seeing the test webhook secret"

**Solution:**
1. Make sure you're on the **test** tab
2. Scroll down to "Webhook Configuration"
3. The secret displays as a separate field

### "Payment redirects to Paystack but errors out"

**Check:**
1. ✅ Email field was filled
2. ✅ API key in `.env.local` is correct (no extra spaces)
3. ✅ Amount is in ZAR (e.g., 100 for R100)
4. Paystack dashboard shows the transaction?

### "Webhook not being received"

**Local testing:**
- Use Paystack's test event sender in dashboard

**Production:**
- Webhook URL must be HTTPS (not HTTP)
- Add logging to webhook handler: `/api/webhooks/stripe/route.ts`
- Check Paystack logs tab to see what they're sending

### "First bank payout takes forever"

**Normal timeline:**
- Verification approved: 1-3 days
- First settlement: 7-10 business days
- Subsequent: Daily (overnight typically)

Contact Paystack support if over 10 days: support@paystack.com

---

## 📚 Documentation Files Created

Keep these handy:

1. **PAYSTACK_SETUP_GUIDE.md** - Detailed steps (this covers most of it)
2. **PAYSTACK_MIGRATION_STATUS.md** - What changed, what's done
3. **STRIPE_TO_PAYSTACK_MIGRATION.md** - Technical migration details
4. **RECORD_LABEL_SETUP.md** - Updated overall setup (has Paystack section)

---

## ✅ Checklist for Completion

### Local Testing Phase
- [ ] Created Paystack account
- [ ] Copied test API keys to `.env.local`
- [ ] Tested payment flow locally
- [ ] Verified Firestore records updated
- [ ] Checked webhook receives test events

### Verification Phase (For Live Keys)
- [ ] Submitted verification documents
- [ ] Paystack approved verification
- [ ] Received live API keys
- [ ] Set up bank account for settlements
- [ ] Bank account verified by Paystack

### Production Phase
- [ ] Updated live keys in production environment
- [ ] Updated webhook URL in Paystack to production
- [ ] Tested webhook with production environment
- [ ] Made first test transaction with live account
- [ ] Verified settlement to bank account

---

## 🎓 Key Reminders

1. **Amount Format**: Always in **kobo** (ZAR × 100)
   - R100 = 10,000 kobo
   - The code handles this conversion

2. **Email Required**: Unlike Stripe, Paystack needs email
   - It's used to identify the customer
   - Must be included in the payment request

3. **Test vs Live Keys**:
   - Never expose live keys in code
   - Always use environment variables
   - Test keys work with fake card 4084084084084081

4. **Webhook Security**:
   - Always verify the signature
   - Use HMAC-SHA512
   - Code already does this: `verifyWebhookSignature()`

5. **South African Specifics**:
   - Settlements in ZAR to South African bank
   - Daily payouts after 7-10 day initial period
   - Check Paystack SA status for holidays/delays

---

## 🆘 Getting Help

**Paystack Support:**
- Email: support@paystack.com
- Chat: Available in dashboard
- Phone: +234 803 000 0000 (Nigeria) - limited for ZA
- Status: https://status.paystack.com

**Your Issues:**
1. Check console for errors
2. Check Paystack dashboard transaction logs
3. Check Firestore for data
4. Check `.env` variables are correct
5. Search Paystack docs: https://paystack.com/docs

---

## 🎉 You're All Set!

Once you complete this checklist, your platform will be accepting payments in ZAR through Paystack. Users can submit tracks, pay R100, and your money flows directly to your South African bank account.

**Questions?** Refer to:
- PAYSTACK_SETUP_GUIDE.md (comprehensive)
- PAYSTACK_MIGRATION_STATUS.md (what changed)
- Your code logs during testing

Happy first payment! 🚀
