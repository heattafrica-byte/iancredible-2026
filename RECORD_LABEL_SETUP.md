# Record Label Platform - Implementation Guide

## ✅ Completed Components

### Core Infrastructure
- ✅ Authentication Context (`lib/auth-context.tsx`)
- ✅ Firestore Utilities (`lib/firestore-utils.ts`)
- ✅ Paystack Integration (`lib/stripe-utils.ts` - now Paystack utilities)
- ✅ Role-Based Permissions (`lib/permissions.ts`)
- ✅ Protected Routes Hook (`hooks/useProtectedRoute.ts`)
- ✅ API Endpoints for Payments & Webhooks

### Authentication Pages
- ✅ Login Page (`app/auth/login/page.tsx`)
- ✅ Signup Page (`app/auth/signup/page.tsx`)

### User Features
- ✅ Dashboard (`app/dashboard/page.tsx`)
- ✅ Profile Management (`app/dashboard/profile/page.tsx`)
- ✅ Record Label Catalog (`app/record-label/page.tsx`)
- ✅ Track Details (`app/record-label/[trackId]/page.tsx`)
- ✅ Artist Profile Page (`app/record-label/artist/[artistId]/page.tsx`)
- ✅ Track Submission (`app/submit/track/page.tsx`)

### Admin Features
- ✅ Admin Dashboard (`app/admin/dashboard/page.tsx`)
- ✅ User Management (`app/admin/users/page.tsx`)
- ✅ Submission Review (`app/admin/submissions/page.tsx`)
- ✅ Track Management (`app/admin/tracks/page.tsx`)
- ✅ Payment Management (`app/admin/payments/page.tsx`)
- ✅ Analytics (`app/admin/analytics/page.tsx`)
- ✅ Announcements (`app/admin/announcements/page.tsx`)

---

## 🔧 Setup Instructions

### 1. Install Dependencies ✅ DONE
```bash
npm install paystack react-hook-form zod axios date-fns
```

### 2. Environment Variables Setup

Copy the template and fill in your actual keys:
```bash
cp .env.example .env.local
```

Required values:
```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Paystack
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_WEBHOOK_SECRET=xxx
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (iancredible-website)
3. Enable **Cloud Firestore**:
   - Go to Build > Firestore Database
   - Create database (start in test mode for development)
4. Enable **Cloud Storage**:
   - Go to Build > Storage
5. Update **Security Rules** (see section below)

### 4. Create Firestore Collections

The collections are auto-created with your first document, but here's the schema:

```javascript
// In Firebase Console > Firestore Database:

// 1. Create 'users' collection with sample doc:
{
  uid: "user123",
  email: "user@example.com",
  displayName: "User Name",
  role: "member", // member | artist | admin
  avatar: "https://...",
  bio: "My bio",
  socialLinks: {
    twitter: "handle",
    instagram: "handle",
    spotify: "url"
  },
  subscriptionStatus: "free", // free | premium
  createdAt: timestamp,
  updatedAt: timestamp,
  onboardingComplete: false,
  preferences: {
    notifications: true,
    newsletter: true
  }
}

// 2. Create 'tracks' collection
// 3. Create 'submissions' collection
// 4. Create 'payments' collection
// 5. Create 'announcements' collection
```

### 5. Stripe Account Setup
Paystack Account Setup

1. Create [Paystack Account](https://paystack.com) (supports South Africa!)
2. Go to Settings > API Keys & Webhooks
3. Copy Secret Key
4. Add webhook endpoint:
   - Webhook URL: `https://yourdomain.com/api/webhooks/stripe` (rename to /paystack in production)
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `customer.subscription.created`
     - `customer.subscription.deleted`

### 6. Firestore Security Rules

Update your security rules in Firebase Console:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users - own profile readable/writable, others readable
    match /users/{userId} {
      allow read: if true;
      allow create: if request.auth.uid == userId;
      allow update, delete: if request.auth.uid == userId || isAdmin();
    }
    
    // Tracks - public readable, artists can create
    match /tracks/{trackId} {
      allow read: if true;
      allow create: if isArtist();
      allow update, delete: if isOwner(resource.data.artistId) || isAdmin();
    }
    
    // Submissions - artists can create own, admin can read/update all
    match /submissions/{submissionId} {
      allow read: if isArtist() && request.auth.uid == resource.data.artistId || isAdmin();
      allow create: if isArtist();
      allow update, delete: if isAdmin();
    }
    
    // Payments - users can read own, admin can read all
    match /payments/{paymentId} {
      allow read: if request.auth.uid == resource.data.userId || isAdmin();
      allow create, update, delete: if isAdmin();
    }
    
    // Announcements - public readable, admin only writable
    match /announcements/{announcementId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isArtist() {
      return isAuthenticated() && 
             (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'artist' ||
              get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
  }
}
```

### 7. Cloud Storage Security Rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Authorized uploads to user paths
    match /submissions/{userId}/{allPaths=**} {
      allow write: if request.auth.uid == userId;
      allow read: if true;
    }
    
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

### 8. Initialize Your Admin Account

1. Sign up normally at `/auth/signup`
2. In Firebase Console:
   - Go to Firestore
   - Find your user document in `users` collection
   - Edit and change `role` from `member` to `admin`
3. Refresh and access admin panel at `/admin/dashboard`

---

## 📋 Features Checklist

### User Account Management
- ✅ User signup/login
- ✅ Profile creation
- ✅ Edit profile information
- ✅ Social links
- ⏳ Avatar upload (needs storage configuration)
- ⏳ Email verification
- ⏳ Password reset

### Record Label
- ✅ Browse published tracks
- ✅ Filter by genre
- ✅ View track details
- ✅ Artist profiles
- ✅ Audio player
- ⏳ Distribution links (Spotify, Apple Music, etc.)
- ⏳ Share functionality

### Artist Features
- ✅ Submit tracks
- ✅ Upload audio files
- ✅ View submission status
- ✅ See published tracks
- ⏳ Track analytics
- ⏳ Royalty dashboard

### Payment System
- ✅ Paystack integration
- ✅ Payment intent creation
- ✅ Webhook handling
- ⏳ Payment confirmation emails
- ⏳ Invoice generation
- ⏳ Subscription management

### Admin Features
- ✅ View all users
- ✅ Review submissions
- ✅ Approve/reject tracks
- ✅ Manage tracks
- ✅ View payments
- ✅ Analytics dashboard
- ✅ Manage announcements
- ⏳ User suspension/roles
- ⏳ Revenue reports (CSV export)
- ⏳ Bulk operations

---

## 🚀 Deployment

### Firebase Hosting (Frontend)
```bash
npm run build
firebase deploy
```

### Cloud Run (Backend - if using)
Already deployed at: https://cosmic-flow-796662323239.us-central1.run.app

### Environment Variables
Add to your hosting platform (Vercel, Firebase, etc.):
- All NEXT_PUBLIC_* variables
- PAYSTACK_SECRET_KEY (backend only)
- PAYSTACK_WEBHOOK_SECRET (backend only)

---

## 📝 Next Steps

### TODO:
1. **Configure Paystack Account**
   - Set up Paystack account
   - Get API secret key
   - Configure webhook

2. **Test Payment Flow**
   - Try submitting a track
   - Complete payment process (R100 ZAR)
   - Check Firestore for records

3. **Customize Admin Panel**
   - Add your logo
   - Update branding colors
   - Customize dashboard layout

4. **Add Content**
   - Upload sample tracks
   - Create artist accounts
   - Post announcements

5. **Email Notifications** (Optional)
   - Integrate SendGrid or similar
   - Send submission confirmations
   - Payment receipts

6. **Analytics & SEO**
   - Add Google Analytics
   - Implement Open Graph
   - SEO optimization

---

## 🐛 Troubleshooting

### "Auth context not available"
- Make sure AuthProvider wraps your app in layout.tsx
- Check that 'use client' directive is present

### Firestore errors
- Check security rules are set correctly
- Verify collection names match exactly
- Ensure authentication is working

### Paystack errors
- Verify API keys in .env.local
- Check webhook signature secret (HMAC-SHA512)
- Test with Paystack test credentials

### File uploads not working
- Check Cloud Storage rules
- Verify bucket name in environment
- Check Firebase Storage is enabled

---

## 💡 Tips

- Use Paystack test keys during development
- Test payment flow with Paystack test credentials
- Monitor Firestore usage in console
- Set up billing alerts in Google Cloud

---

## 📞 Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
