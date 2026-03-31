# Setting Up Admin Access - No Collections Yet

**Status**: Firestore collections don't exist yet
**Email**: iancrediblemusic@gmail.com
**Action Required**: Create collections and set admin role

---

## Option 1: Automatic Setup (Recommended)

### Step 1: Create Your Account

1. Go to: https://iancredible-portfolio-796662323239.us-central1.run.app/auth/signup
2. Fill in:
   - **Display Name**: Ian (or your name)
   - **Email**: iancrediblemusic@gmail.com
   - **Password**: Create a strong password (8+ characters)
3. Click "Create Account"

**What happens automatically:**
- Firebase Auth user is created
- Firestore `users` collection is created automatically
- Your user document is created with `role: member`

✓ This is the easiest way to bootstrap the collections

---

## Option 2: Manual Setup (If Option 1 doesn't create collections)

### Step 1: Create Users Collection Manually

1. Open Firebase Console: https://console.firebase.google.com
2. Select project: **iancredible-website**
3. Go to **Build** → **Firestore Database**
4. Click **"Create collection"**
5. Enter collection name: `users`
6. Click **"Next"**

### Step 2: Create Your Admin Document

7. For Document ID, you have two options:
   - **Auto-ID** (Firebase generates it automatically) - click "Auto-ID"
   - **Custom ID** (use your Firebase UID if you know it)

8. Use **Auto-ID** for now
9. Add these fields:

| Field | Type | Value |
|-------|------|-------|
| email | string | iancrediblemusic@gmail.com |
| role | string | admin |
| displayName | string | Ian |
| photoURL | string | /images/street-art-portrait.png |
| createdAt | timestamp | (click "Server timestamp") |
| updatedAt | timestamp | (click "Server timestamp") |

10. Click **"Save"**

✓ Your admin user document is created

---

## Step 3: Create Your Firebase Auth Account

Even with the Firestore document, you need a Firebase Auth account to login.

1. Go to: https://iancredible-portfolio-796662323239.us-central1.run.app/auth/signup
2. Sign up with:
   - Email: iancrediblemusic@gmail.com
   - Password: (your password)

**Important**: The signup process will try to create a `users` document. It will use the Firebase UID from auth as the document ID.

---

## After Setup: Link Auth to Firestore

If you went with Option 2, you may have two documents:
- One with auto-generated ID from manual setup
- One with Firebase UID from signup

**To fix this:**

1. Get your Firebase UID:
   - Login to app
   - Open browser developer console (F12)
   - Run: `localStorage.getItem('firebase:authUser:*')` and find the uid

2. In Firebase Console:
   - Delete the auto-ID document you created manually
   - Create new document with the Firebase UID as ID
   - Add the same fields as before

---

## Recommended Path (Fastest)

Follow this exact order:

1. ✅ Go to signup: https://iancredible-portfolio-796662323239.us-central1.run.app/auth/signup
2. ✅ Create account with iancrediblemusic@gmail.com
3. ✅ After signup, go to Firebase Console
4. ✅ Find your user document in `users` collection (it should now exist)
5. ✅ Edit the `role` field: `member` → `admin`
6. ✅ Logout and login again
7. ✅ Verify `/admin/dashboard` is accessible

---

## What the Signup Process Creates

When you sign up, the app runs this code:

```typescript
// app/auth/signup/page.tsx
await createUserWithEmailAndPassword(auth, data.email, data.password)
await createUserProfile(userCredential.user.uid, {
  email: data.email,
  displayName: data.displayName,
  role: 'member'
})
```

This:
1. Creates Firebase Auth user
2. Creates `users` collection (if it doesn't exist)
3. Creates document with Firebase UID as ID
4. Sets fields: email, displayName, role: 'member'

---

## Need Collections Created Manually?

If signup doesn't create collections, here are the collections you'll need:

### users
```
Document ID: (Firebase UID)
Fields:
  - email: string
  - role: string ('member', 'artist', 'admin')
  - displayName: string
  - photoURL: string (optional)
  - createdAt: timestamp
  - updatedAt: timestamp
```

### tracks
```
Document ID: (auto-generated)
Fields:
  - title: string
  - artistId: string
  - artistName: string
  - genre: string
  - description: string
  - audioUrl: string
  - coverArt: string (optional)
  - status: string ('pending', 'approved', 'rejected', 'published')
  - createdAt: timestamp
  - updatedAt: timestamp
  - stats: map
    - plays: number
    - favorites: number
```

### submissions
```
Document ID: (auto-generated)
Fields:
  - userId: string
  - userEmail: string
  - title: string
  - genre: string
  - description: string
  - audioUrl: string
  - coverArt: string
  - status: string ('pending', 'approved', 'rejected')
  - feedback: string
  - submittedAt: timestamp
```

### payments
```
Document ID: (auto-generated)
Fields:
  - userId: string
  - amount: number
  - currency: string ('ZAR', 'USD')
  - status: string ('pending', 'success', 'failed')
  - paymentType: string ('submission', 'subscription', 'other')
  - paymentMethod: string ('paystack', 'stripe')
  - reference: string
  - createdAt: timestamp
  - updatedAt: timestamp
```

---

## Quick Start

**Do this now:**

1. Click: https://iancredible-portfolio-796662323239.us-central1.run.app/auth/signup
2. Sign up with iancrediblemusic@gmail.com
3. Report back with result:
   - Did you see collections created in Firestore?
   - Did your user document appear?

Once account is created, I'll help you verify the admin access.
