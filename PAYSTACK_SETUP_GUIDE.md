# Paystack Integration Setup Guide

## Overview
This guide walks you through setting up Paystack payment processing for the Record Label platform. Paystack is ideal for South African businesses and supports 15+ African currencies including ZAR.

---

## 1. Create a Paystack Account

### Steps:
1. Go to [Paystack.com](https://paystack.com)
2. Click **Sign Up**
3. Fill in your business details:
   - Business Name
   - Email
   - Phone Number
   - Password
4. Verify your email
5. Complete business verification (upload ID, business documents as required)

### Account Tiers:
- **Free Tier** - Create and test payments (no live verification needed)
- **Business** - Live payments & settlements

---

## 2. Get Your API Keys

### From Paystack Dashboard:
1. Login to [Paystack Dashboard](https://dashboard.paystack.com)
2. Go to **Settings** (left sidebar)
3. Click **API Keys & Webhooks**
4. You'll see two keys:
   - **Test Keys** (for development)
   - **Live Keys** (for production - requires business verification)

### Copy Your Keys:
- **SECRET_KEY**: `sk_test_xxxxx` (Test) or `sk_live_xxxxx` (Live)
- **PUBLIC_KEY**: `pk_test_xxxxx` (Test) or `pk_live_xxxxx` (Live)

---

## 3. Update Environment Variables

In `.env.local` (development):
```env
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret_here
```

### How to Get Webhook Secret:
1. Go to Paystack Dashboard > Settings > API Keys & Webhooks
2. Scroll to **Webhook Configuration**
3. There's a secret displayed below the webhook URL input
4. Copy this value for `PAYSTACK_WEBHOOK_SECRET`

### For Production:
```env
PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key
PAYSTACK_WEBHOOK_SECRET=your_live_webhook_secret
```

---

## 4. Configure Webhook Endpoint

### In Paystack Dashboard:

1. Go to **Settings > API Keys & Webhooks**
2. Find the **Webhook URL** section
3. Enter your webhook URL:
   ```
   https://yourdomain.com/api/webhooks/stripe
   ```
   *(Note: Eventually rename to `/paystack` in production)*

4. Events to subscribe to:
   - ✅ `charge.success` - Payment completed
   - ✅ `charge.failed` - Payment failed
   - ✅ Optional: `subscription.create`, `subscription.disable`

5. Save the configuration

### Test Webhook:
From the Paystack dashboard, you can send test webhook events to verify your endpoint is receiving them correctly.

---

## 5. Test the Integration

### Using Test Credentials:

**Test Card Details** (from Paystack):
```
Card Number: 4084084084084081
Expiry: Any future date (e.g., 01/25)
CVV: 408
```

### Test Payment Flow:

1. In your app, navigate to **Submit Track** page
2. Fill in track details
3. Click **Submit Track & Pay R100 (Paystack)**
4. You'll be redirected to Paystack checkout
5. Use test card details above
6. Complete payment
7. System will reflect payment in Firestore

### Check Payment Records:

1. Login as **Admin**
2. Go to **Payment Management**
3. Verify the test payment appears with status `completed`
4. Check Firestore directly: `payments` collection should have new documents

---

## 6. Configure South African Settlement

### Bank Account Setup:

1. In Paystack Dashboard > **Settings > Bank Accounts**
2. Click **Add Bank Account**
3. Fill in:
   - Bank Name (South African bank)
   - Account Number
   - Account Name
   - Branch Code (if required)
4. Verify the account (Paystack may debit a small amount for verification)

### Settlement Schedule:

- Default: Daily settlements at midnight
- Minimum payout: R100
- Fees: Check current fees in Paystack Dashboard

### Manual Payouts:

You can also manually request payouts from:
- Paystack Dashboard > **Payouts**
- Select amount and destination account

---

## 7. Handle Different Currency/Payment Methods

### For Different Currencies:

Update payment amounts in your code (`app/submit/track/page.tsx`):

```typescript
// Current: R100 ZAR
const SUBMISSION_FEE_ZAR = 10000; // in kobo (100 ZAR)

// For other currencies:
// GHS: amount_in_cedis * 100
// NGN: amount_in_naira * 100
// KES: amount_in_shillings * 100
// USD: amount_in_dollars * 100
```

### Supported Payment Methods:

Paystack supports:
- ✅ Card (Visa, Mastercard, Verve)
- ✅ Bank Transfer (South African & international)
- ✅ USSD (Nigeria)
- ✅ Mobile Money (regional)
- ✅ Wallet

---

## 8. Production Deployment

### Before Going Live:

1. ✅ Complete Paystack business verification
2. ✅ Get **Live Keys** from Paystack
3. ✅ Test thoroughly with test keys
4. ✅ Update `.env` with live keys
5. ✅ Configure live webhook URL (HTTPS required)
6. ✅ Set up bank account for settlements
7. ✅ Update domain in Paystack allowed origins (if applicable)

### Deploy to Firebase/Vercel:

Add environment variables to your hosting:

**Firebase Hosting:**
```bash
firebase functions:config:set paystack.secret_key="sk_live_..." paystack.webhook_secret="..."
```

**Vercel:**
1. Go to Project Settings > Environment Variables
2. Add:
   - `PAYSTACK_SECRET_KEY` = sk_live_...
   - `PAYSTACK_WEBHOOK_SECRET` = ...
3. Redeploy

### Update Webhook URL:

In Paystack Dashboard:
- Change webhook URL from test to production domain
- Ensure HTTPS is enabled
- Test webhook from dashboard

---

## 9. Monitoring Payments

### In Paystack Dashboard:

- **Transactions** - View all payments in real-time
- **Reports** - Payment analytics and history
- **Settlements** - Track payouts to your account
- **Customers** - Manage customer records

### In Your App:

- **Admin Dashboard > Payment Management**
  - View all submissions and their payment status
  - Filter by user, date range, status
  - Manually mark payments if needed
  - Download payment reports

### Reconciliation:

Regularly compare:
- Paystack Dashboard transaction count
- Your app's `payments` collection in Firestore
- Bank settlements received

---

## 10. Troubleshooting

### Payment Not Processing

**Check:**
1. API keys are correct in `.env.local`
2. User entered valid payment details
3. Bank/card restrictions (contact payment issuer)
4. Paystack service status

### Webhook Not Received

**Check:**
1. Webhook URL is correct in Paystack Dashboard
2. Domain is publicly accessible
3. HTTPS is enabled (required)
4. Webhook signature verification in code
5. Firestore permissions allow writes from the webhook handler

### Wrong Amount in Conversion

**Remember:**
- Paystack uses **kobo** (1 ZAR = 100 kobo)
- Multiply all amounts by 100: `100 ZAR = 10000 kobo`

See the `initializePayment()` function in `lib/stripe-utils.ts` for the conversion.

### Settlement Delays

- First settlement: 7-10 business days
- Subsequent: Usually daily
- Check settlement account configuration
- Verify bank account was verified

### Customer Duplicate Emails

If a customer pays with same email twice:
- Paystack links them together
- Your code should handle this gracefully
- Verify payment by amount + email combo

---

## 11. Security Best Practices

### Webhook Signature Verification

The code already implements this:
```typescript
const verified = verifyWebhookSignature(
  JSON.stringify(body),
  signature,
  process.env.PAYSTACK_WEBHOOK_SECRET!
);
```

### Never Log Sensitive Data

- Don't log card numbers
- Don't log API keys
- Don't log webhook body to files

### PCI Compliance

- Paystack handles all card data (PCI DSS compliant)
- Your app never touches raw card info
- Always use HTTPS in production

---

## 12. Support & Resources

- **Paystack Status Page**: https://status.paystack.com
- **Paystack Documentation**: https://paystack.com/docs
- **Paystack Support**: https://paystack.com/support
- **Email**: support@paystack.com (South African based support team)

---

## Quick Checklist

- [ ] Created Paystack account
- [ ] Got Secret Key & Webhook Secret
- [ ] Added to `.env.local`
- [ ] Configured webhook URL in Paystack
- [ ] Tested with test card
- [ ] Verified payment appears in app & Firestore
- [ ] Set up South African bank account
- [ ] Tested withdrawal/settlement
- [ ] Got Live Keys
- [ ] Updated production environment variables
- [ ] Verified webhook works with live account
- [ ] Monitored first live transactions

---

## Next Steps

1. Complete the checklist above
2. Test the full payment flow (track submission + payment)
3. Verify settlements to your bank account
4. Set up monitoring/alerts for failed payments
5. Document your payment processes for team

Good luck! 🚀
