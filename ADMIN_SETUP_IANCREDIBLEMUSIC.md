# Admin Setup for iancrediblemusic@gmail.com

## Status: Ready to Setup

**Email**: iancrediblemusic@gmail.com
**Target Role**: admin
**Date**: 29 March 2026

---

## Step 1: Create Your Account (if you don't have one)

If you haven't already created an account with this email:

1. Go to: https://iancredible-portfolio-796662323239.us-central1.run.app/auth/signup
2. Enter:
   - **Display Name**: Your name (e.g., "Ian")
   - **Email**: iancrediblemusic@gmail.com
   - **Password**: Choose a strong password (8+ characters)
3. Click "Create Account"
4. You'll be redirected to `/dashboard`

✓ This creates your user in Firebase with role `member`

---

## Step 2: Upgrade to Admin Role

Now you need to change your role from `member` to `admin` in the Firestore database.

### Via Firebase Console (Recommended)

1. Open Firebase Console: https://console.firebase.google.com
2. Select project: **iancredible-website**
3. Go to **Build** → **Firestore Database**
4. Click on **Collections** → **users**
5. Find your user document by email (iancrediblemusic@gmail.com)
6. Click on the document to open it
7. Edit the `role` field:
   - **Old value**: `member`
   - **New value**: `admin`
8. Save the changes

✓ Your account is now an admin

---

## Step 3: Verify Admin Access

1. **Logout** from the app (click logout at top right)
2. **Login again** with your credentials:
   - Email: iancrediblemusic@gmail.com
   - Password: (your password)
3. You'll be redirected to `/dashboard`
4. You should now see admin menu items in the top navigation

---

## Step 4: Access Admin Dashboard

Once logged in as admin, you can access these pages:

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/admin/dashboard` | Overview & metrics |
| Users | `/admin/users` | Manage users & roles |
| Submissions | `/admin/submissions` | Approve/reject tracks |
| Tracks | `/admin/tracks` | Manage published tracks |
| Payments | `/admin/payments` | View transactions |
| Announcements | `/admin/announcements` | Create announcements |
| Analytics | `/admin/analytics` | Platform statistics |

---

## View Your Firestore User Document

**Collection**: `users`
**Document ID**: (Your Firebase UID - assigned when account created)

**Document fields should be**:
```
email: "iancrediblemusic@gmail.com"
displayName: "Your Name"
role: "admin"
photoURL: "/images/street-art-portrait.png"
createdAt: (timestamp)
updatedAt: (timestamp)
```

---

## Troubleshooting

### Admin Dashboard Not Visible
- **Problem**: Can't see admin menu after logging in
- **Solution**: 
  1. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
  2. Logout completely
  3. Login again
  4. Check Firestore that role is `admin` (not `member`)

### Can't Find User Document
- **Problem**: Can't locate user in Firestore 
- **Solution**:
  1. Make sure you're in correct project: `iancredible-website`
  2. Collection should be named exactly: `users`
  3. Search by email field or create new document if missing

### Role Changed But Still No Admin Access
- **Problem**: Role is `admin` but no dashboard access
- **Solution**:
  1. Clear browser cache
  2. Sign-out completely: https://iancredible-portfolio-796662323239.us-central1.run.app/auth/login
  3. Close browser completely and reopen
  4. Sign in again

---

## Next Steps After Admin Setup

1. ✅ Create account with iancrediblemusic@gmail.com
2. ✅ Set role to `admin` in Firestore
3. ✅ Verify admin dashboard access
4. ✅ Review Platform Settings (from [COMPLETE_SETUP_INDEX.md](COMPLETE_SETUP_INDEX.md))
5. ✅ Configure Paystack for payments (see [PAYSTACK_SETUP_GUIDE.md](PAYSTACK_SETUP_GUIDE.md))
6. ✅ Test payment flows through admin dashboard
7. ✅ Manage users and track submissions

---

## Quick Reference

- **Live Site**: https://iancredible-portfolio-796662323239.us-central1.run.app
- **Login Page**: /auth/login
- **Signup Page**: /auth/signup
- **Admin Dashboard**: /admin/dashboard
- **Firebase Console**: https://console.firebase.google.com
- **Project**: iancredible-website

---

## Support

If you need help with admin setup, refer to:
- [ADMIN_SETUP_GUIDE.md](ADMIN_SETUP_GUIDE.md) - General admin setup
- [COMPLETE_SETUP_INDEX.md](COMPLETE_SETUP_INDEX.md) - Main index
- [RECORD_LABEL_ARCHITECTURE.md](RECORD_LABEL_ARCHITECTURE.md) - Technical details
