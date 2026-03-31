# Admin Setup Guide

## Index Location

**Main Index File**: `COMPLETE_SETUP_INDEX.md` (Project Root)

**Path**: `/Users/admin/Documents/AIAIAI/New iancredible site 2026/COMPLETE_SETUP_INDEX.md`

**Also Referenced**: 
- `RECORD_LABEL_QUICK_START.md` - Feature overview
- `RECORD_LABEL_ARCHITECTURE.md` - Technical details
- `PAYSTACK_SETUP_GUIDE.md` - Payment configuration

---

## How to Set Your Email as Admin

### Method 1: Firebase Console (Quickest)

1. Go to https://console.firebase.google.com
2. Select project: **iancredible-website**
3. Go to **Firestore Database** → **Collections** → **users**
4. Find your user document (or create new document)
5. Set these fields:
   ```
   email: your-email@example.com
   role: admin
   displayName: Your Name
   displayName: Your Name
   ```

### Method 2: Create Account First, Then Admin

**Step 1: Create Account**
- Go to: https://iancredible-portfolio-796662323239.us-central1.run.app/auth/signup
- Enter your email and password (8+ characters)
- This creates your user in Firebase

**Step 2: Make Yourself Admin**
- Open Firebase Console → Firestore
- Find your email in the `users` collection
- Edit the document and change `role` field from `member` to `admin`

### Method 3: Use Admin Dashboard Access

Once you're logged in:
1. Access admin dashboard at: `/admin/dashboard`
2. Go to Users section
3. Find your user and toggle admin role

---

## Verify Admin Access

After setting role to `admin`:

1. **Logout**: https://iancredible-portfolio-796662323239.us-central1.run.app (click logout)
2. **Login again** with your email
3. **Access admin area**: https://iancredible-portfolio-796662323239.us-central1.run.app/admin/dashboard

You should now see:
- Users management
- Track submissions/approvals
- Payment records
- Analytics
- Announcements

---

## User Roles Explained

| Role | Permissions | Access |
|------|-------------|--------|
| **member** | View catalog, profile | `/dashboard`, `/record-label` |
| **artist** | Submit tracks, view own | Plus `/submit/track` |
| **admin** | Full platform control | Plus `/admin/*` all pages |

---

## Important Files for Admin

- `app/admin/dashboard/page.tsx` - Main admin dashboard
- `app/admin/users/page.tsx` - User management
- `app/admin/submissions/page.tsx` - Track approvals
- `app/admin/payments/page.tsx` - Payment records
- `app/admin/analytics/page.tsx` - Platform metrics
- `app/admin/announcements/page.tsx` - Create announcements
- `app/admin/tracks/page.tsx` - Manage published tracks

---

## Firestore User Schema

```typescript
// users collection
{
  email: string
  role: 'member' | 'artist' | 'admin'
  displayName: string
  photoURL?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

---

## Next Steps After Admin Setup

1. ✅ Set role to `admin` in Firestore
2. ✅ Login and verify access to `/admin/dashboard`
3. ✅ Review user management (admin/users)
4. ✅ Set up Paystack keys (COMPLETE_SETUP_INDEX.md)
5. ✅ Test payment flows
