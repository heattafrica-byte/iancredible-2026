# Stripe to Paystack Migration - Completion Summary

## Migration Status: ✅ COMPLETE

This document summarizes the complete migration from Stripe (USD) to Paystack (ZAR) payment processing.

---

## Why the Switch?

- **Stripe Limitation**: Not available in South Africa
- **Paystack Benefit**: Native South African support with ZAR currency
- **Location**: Business based in South Africa requires ZAR transactions
- **Cost Basis**: R100 ZAR per submission instead of $10 USD

---

## Code Changes Summary

### 1. NPM Package Updates

**Removed:**
```bash
npm uninstall stripe @stripe/react-stripe-js
```

**Added:**
```bash
npm install paystack
```

**Current Dependencies** (Payment Related):
- ✅ `paystack` - Paystack API SDK
- ✅ `axios` - HTTP client for API calls
- ✅ `crypto` - For HMAC-SHA512 signature verification

---

### 2. Files Modified

#### a) `lib/stripe-utils.ts` (→ Now Paystack Utilities)

**Old Implementation**: Stripe secret key, payment intents, event verification
**New Implementation**: Paystack API integration with KObo amounts (ZAR × 100)

**Key Functions Updated:**

```typescript
// OLD
export const createPaymentIntent = async (amount: number, ...)
// NEW
export const initializePayment = async (userId: string, email: string, amount: number, ...)

// OLD: Uses Stripe API
// NEW: Uses Paystack API at https://api.paystack.co

// Signature verification changed:
// OLD: stripe.webhooks.constructEvent()
// NEW: verifyWebhookSignature(body, signature, secret) using HMAC-SHA512
```

**Parameters Updated:**
- Amounts now in **kobo** (multiply ZAR by 100): 100 ZAR = 10,000 kobo
- Email now required for Paystack customer identification
- Returns `authorizationUrl` instead of `clientSecret`

---

#### b) `app/api/payments/create-intent/route.ts`

**Changes:**
```typescript
// OLD
const { clientSecret } = await createPaymentIntent(...)
response.json({ clientSecret, ... })

// NEW
const { authorizationUrl, accessCode, reference } = await initializePayment(...)
response.json({ authorizationUrl, accessCode, reference })
```

**Endpoint expects:**
- `userId: string`
- `email: string` (NEW - required)
- `amount: number` (ZAR)
- `type: string`
- `relatedId: string`

---

#### c) `app/api/webhooks/stripe/route.ts` (→ Now Paystack Handler)

**Changes:**
```typescript
// Header verification
// OLD: Uses Stripe's webhook signature method
// NEW: Checks x-paystack-signature header with HMAC-SHA512

// Event handling
// OLD: Listens for payment_intent.succeeded/failed
// NEW: Listens for charge.success/charge.failed

// Webhook secret
// OLD: STRIPE_WEBHOOK_SECRET
// NEW: PAYSTACK_WEBHOOK_SECRET
```

**Security:** All webhook calls verified with HMAC-SHA512 signature before processing

---

#### d) `app/submit/track/page.tsx`

**UI Changes:**
```typescript
// Fee display
// OLD: "$10.00 USD"
// NEW: "R100.00 ZAR"

// Button text
// OLD: "Submit Track & Pay $10"
// NEW: "Submit Track & Pay R100 (Paystack)"

// Payment flow
// OLD:
// 1. Get clientSecret from API
// 2. Load Stripe Elements
// 3. Confirm payment client-side
// NEW:
// 1. Get authorizationUrl from API
// 2. Redirect to Paystack checkout
// 3. User pays on Paystack site
// 4. Webhook confirms payment
```

**Removed Stripe Imports:**
```typescript
// DELETED
import { loadStripe } from '@stripe/js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
```

---

### 3. Environment Variables

**Updated `.env.local` (Development):**

**Before:**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**After:**
```env
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_WEBHOOK_SECRET=...
```

**For Production:**
```env
PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_WEBHOOK_SECRET=...
```

---

## API Integration Changes

### Paystack API Endpoints Used

1. **Initialize Payment**
   ```
   POST https://api.paystack.co/transaction/initialize
   Headers: Authorization: Bearer sk_test_...
   Body: {
     email: string,
     amount: number (kobo),
     metadata: {
       userId: string,
       type: string,
       relatedId: string
     }
   }
   ```

2. **Verify Payment**
   ```
   GET https://api.paystack.co/transaction/verify/:reference
   Headers: Authorization: Bearer sk_test_...
   ```

3. **Webhook Verification**
   - Header: `x-paystack-signature` (HMAC-SHA512)
   - Events: `charge.success`, `charge.failed`

---

## Payment Flow Comparison

### OLD (Stripe)
```
User submits track
  ↓
CREATE INTENT (backend)
  ↓
Returns clientSecret
  ↓
Load Stripe Elements (client-side)
  ↓
Confirm Payment (client-side with card details)
  ↓
Webhook: payment_intent.succeeded
  ↓
Update Firestore
```

### NEW (Paystack)
```
User submits track + email
  ↓
INITIALIZE PAYMENT (backend)
  ↓
Returns authorizationUrl
  ↓
Redirect to Paystack checkout (server-side)
  ↓
User pays on Paystack site (multiple methods: card, bank, USSD, etc.)
  ↓
Webhook: charge.success
  ↓
Update Firestore
```

---

## Testing Checklist

- [ ] Install paystack package locally
- [ ] Add Paystack test keys to `.env.local`
- [ ] Test payment flow end-to-end:
  - Submit track form
  - Enter email
  - Click "Submit & Pay R100"
  - Redirect to Paystack checkout
  - Use test card (4084084084084081)
  - Verify payment in Firestore
- [ ] Check webhook receives payment notifications
- [ ] Verify admin dashboard shows payment status
- [ ] Test with actual Paystack test account

---

## Database Schema Updates

### Firestore `payments` Collection

**Old Fields:**
```javascript
{
  stripePaymentId: string,
  stripeCustomerId: string,
  stripeFeePercentage: 2.9,
  amount: number (USD cents)
}
```

**New Fields:**
```javascript
{
  paystackPaymentId: string, // authorization.authorization_code
  paystackReference: string, // charge.reference
  paystackCustomerId: string,
  amount: number, // ZAR (whole number: 100)
  amountPaid: number, // kobo paid (10000 = R100)
  feeAmount: number // Paystack fee in ZAR
}
```

**Firestore Update Required:**
To migrate old payments (optional):
```javascript
// Can keep old payment records for history
// New payments use paystackPaymentId pattern
```

---

## Deployment Steps

### 1. Local Testing (Current Phase)
```bash
npm install paystack
# Add PAYSTACK_* to .env.local
# Test payment flow with test keys
```

### 2. Staging/Production Deployment
```bash
# Update .env variables in hosting platform
# Vercel: Settings > Environment Variables
# Firebase: firebase functions:config:set

# Add PAYSTACK_SECRET_KEY
# Add PAYSTACK_WEBHOOK_SECRET
```

### 3. Paystack Configuration
- Create Paystack account (https://paystack.com)
- Get live keys (after verification)
- Configure webhook URL: `https://yourdomain.com/api/webhooks/stripe`
- Set up settlement bank account (South African)

---

## Documentation Updates

### Updated Files:
- ✅ `RECORD_LABEL_SETUP.md` - Installation & environment variables
- ✅ `RECORD_LABEL_ARCHITECTURE.md` - Architecture & API endpoints
- ✅ `PAYSTACK_SETUP_GUIDE.md` (NEW) - Complete Paystack setup guide

### Documentation Changes:
- Replaced all Stripe references with Paystack
- Updated API documentation
- Updated environment variable guidance
- Updated troubleshooting section
- Added ZAR currency throughout

---

## Important Notes

### Amount Conversion
🔴 **Critical**: Paystack works in **kobo**, not ZAR
- 1 ZAR = 100 kobo
- R100 submission fee = 10,000 kobo
- Always multiply ZAR amounts by 100 in `initializePayment()`

### Email Requirement
🔴 **New**: Email is now **required** for Paystack payments
- Previously optional in Stripe flow
- Update payment forms to include email collection

### Webhook Signature
🔴 **Changed**: Uses HMAC-SHA512, not Stripe's raw signature
- Verify with `verifyWebhookSignature()` function
- Must match `PAYSTACK_WEBHOOK_SECRET` exactly

### South African Specifics
✅ ZAR currency support
✅ Local bank account settlements
✅ Supports South: African payment methods (Wallet, Bank Transfer, etc.)
✅ R100 submission fee (vs $10 USD)

---

## Rollback (If Needed)

If reverting to Stripe:
1. Revert NPM packages: `npm install stripe @stripe/react-stripe-js` + uninstall paystack
2. Restore `lib/stripe-utils.ts` from git history
3. Revert changes in `app/api/payments/create-intent/route.ts`
4. Revert changes in `app/api/webhooks/stripe/route.ts`
5. Revert `app/submit/track/page.tsx` to Stripe payment flow

---

## Support & Resources

- **Paystack Documentation**: https://paystack.com/docs
- **Paystack Dashboard**: https://dashboard.paystack.com
- **Setup Guide**: See PAYSTACK_SETUP_GUIDE.md in this repository
- **Test Credentials**: Card: 4084084084084081, Any future expiry, CVV: 408

---

## Next Steps

1. ✅ Code migration: **COMPLETE**
2. ⏭️ Local testing: Start here
3. ⏭️ Paystack account setup: See PAYSTACK_SETUP_GUIDE.md
4. ⏭️ Webhook configuration: Register in Paystack Dashboard
5. ⏭️ Production deployment: Update environment variables
6. ⏭️ Bank account setup: Configure ZAR settlement account
7. ⏭️ Go live: Switch from test to live keys

---

**Migration Date**: 2025  
**Status**: Code Complete, Ready for Testing  
**Responsibility**: Complete the Paystack setup guide steps for full integration
