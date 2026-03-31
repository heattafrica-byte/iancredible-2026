# Record Label Platform Architecture & Implementation Plan

## Overview
Build a comprehensive record label platform with user accounts, artist submissions, payment processing, and admin management capabilities.

---

## 1. Database Schema (Firestore)

### Collections Structure

#### `users`
```typescript
{
  uid: string (Firebase Auth UID)
  email: string
  displayName: string
  role: 'member' | 'artist' | 'admin'
  avatar: string (image URL)
  bio: string
  socialLinks: {
    twitter?: string
    instagram?: string
    spotify?: string
  }
  subscriptionStatus: 'free' | 'premium'
  subscriptionId?: string (Paystack customer ID)
  createdAt: timestamp
  updatedAt: timestamp
  onboardingComplete: boolean
  preferences: {
    notifications: boolean
    newsletter: boolean
  }
}
```

#### `tracks`
```typescript
{
  id: string (auto-generated)
  title: string
  artistId: string (reference to users)
  artistName: string
  coverArt: string (image URL)
  audioUrl: string (Firebase Storage URL)
  description: string
  genre: string
  releaseDate: timestamp
  status: 'draft' | 'published' | 'archived'
  distributionLinks: {
    spotify?: string
    appleMusic?: string
    soundcloud?: string
  }
  stats: {
    plays: number
    downloads: number
    likes: number
  }
  createdAt: timestamp
  updatedAt: timestamp
}
```

#### `submissions`
```typescript
{
  id: string (auto-generated)
  artistId: string (reference to users)
  artistName: string
  artistEmail: string
  trackTitle: string
  genre: string
  audioUrl: string (Firebase Storage URL)
  coverArtUrl: string
  bio: string
  socialLinks: object
  status: 'pending' | 'approved' | 'rejected'
  feedback?: string
  submittedAt: timestamp
  reviewedAt?: timestamp
  reviewedBy?: string (admin uid)
  paymentStatus: 'pending' | 'paid' | 'free'
  paymentId?: string (Paystack payment reference)
}
```

#### `payments`
```typescript
{
  id: string (auto-generated)
  userId: string
  paystackPaymentId: string
  paystackCustomerId: string
  amount: number (in cents)
  currency: string
  status: 'pending' | 'success' | 'failed'
  type: 'submission' | 'subscription' | 'other'
  relatedId?: string (submission ID or subscription ID)
  createdAt: timestamp
  completedAt?: timestamp
  metadata: object
}
```

#### `announcements` (for upcoming releases)
```typescript
{
  id: string
  title: string
  description: string
  coverImage: string
  trackId?: string (reference to tracks - if already released)
  artistName: string
  releaseDate: timestamp
  status: 'upcoming' | 'released'
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

## 2. User Roles & Permissions

### Member
- Browse released tracks
- View artist profiles
- Listen to previews
- Create account and profile
- No submission rights without upgrade

### Artist
- Access submission portal
- Submit tracks for review
- Manage own uploaded tracks
- View submission status
- See analytics on published tracks
- **Requires**: Paystack payment (R100 ZAR submission fee) or one-time verification

### Admin (You - Full Control)
- ✅ User management (view, edit, suspend, delete)
- ✅ Track management (approve, reject, edit, remove)
- ✅ Submission review & approval
- ✅ Payment management (view all transactions)
- ✅ Announcements management
- ✅ Analytics dashboard
- ✅ Site configuration
- ✅ Bulk operations
- ✅ Revenue reports

---

## 3. Architecture Components

### Frontend Structure
```
app/
├── auth/
│   ├── login/
│   ├── signup/
│   └── forgot-password/
├── dashboard/
│   ├── profile/
│   ├── settings/
│   └── submissions/ (artist only)
├── artist/
│   ├── [artistId]/
│   └── profile-edit/
├── record-label/
│   ├── page.tsx (catalog)
│   ├── [trackId]/
│   └── artist/[artistId]/
├── submit/
│   └── track/ (submission portal)
├── admin/
│   ├── dashboard/
│   ├── users/
│   ├── tracks/
│   ├── submissions/
│   ├── payments/
│   └── analytics/
└── components/
    ├── auth/
    ├── forms/
    ├── admin/
    └── record-label/
```

### Key Utilities/Hooks
```
lib/
├── firestore-utils.ts (CRUD operations)
├── stripe-utils.ts (Paystack integration)
├── auth-context.ts (User & role management)
└── permissions.ts (RBAC utilities)

hooks/
├── useAuth.ts
├── useUser.ts
├── useAdmin.ts
├── usePaystack.ts
└── useFirestore.ts
```

---

## 4. API Endpoints (Cloud Functions)

### Authentication
- `POST /auth/login`
- `POST /auth/signup`
- `POST /auth/logout`
- `POST /auth/refresh-token`

### User Management
- `GET /users/:userId` - Get user profile
- `PUT /users/:userId` - Update user profile
- `GET /users/:userId/tracks` - Get user's tracks
- `POST /users/:userId/avatar` - Upload avatar

### Tracks
- `GET /tracks` - List all published tracks (with pagination/filtering)
- `GET /tracks/:trackId` - Get track details
- `GET /tracks/artist/:artistId` - Get artist's tracks
- `POST /tracks` - Create new track (artists only)
- `PUT /tracks/:trackId` - Update track (owner only)
- `DELETE /tracks/:trackId` - Delete track (owner/admin only)

### Submissions
- `POST /submissions` - Submit track for review
- `GET /submissions` - List submissions (admin only)
- `GET /submissions/:id` - Get submission details
- `PUT /submissions/:id/approve` - Approve submission (admin only)
- `PUT /submissions/:id/reject` - Reject submission (admin only)
- `POST /submissions/:id/payment` - Initiate payment for submission

### Payments
- `POST /payments/create-intent` - Create Paystack payment transaction
- `GET /payments/:id` - Get payment details
- `GET /payments/user/:userId` - Get user's payment history
- `POST /payments/webhook` - Paystack webhook endpoint

### Admin
- `GET /admin/analytics` - Site analytics
- `GET /admin/users` - List all users (admin only)
- `GET /admin/revenue` - Revenue reports
- `PUT /admin/settings` - Site settings

---

## 5. Paystack Integration (South Africa Regional Payment)

### Implementation Points
1. **Create Paystack Account** - Set up account at https://paystack.com
2. **Install Paystack SDK** - `npm install paystack`
3. **Environment Variables**
   - `PAYSTACK_SECRET_KEY`
   - `PAYSTACK_WEBHOOK_SECRET`

### Payment Flows
- Submission fee (R100 ZAR per submission)
- Subscription support (optional: R50/month for unlimited submissions)
- Webhook handling for payment confirmation via HMAC-SHA512

### Paystack Events to Handle
- `charge.success`
- `charge.failed`
- `subscription.create`
- `subscription.disable`

---

## 6. Security Considerations

### Firestore Security Rules
```
- Members: Can read published tracks, own profile
- Artists: Can submit tracks, manage own submissions
- Admin: Full access to all collections
```

### File Upload Security
- Audio files stored in Firebase Storage with public read (for distribution)
- Virus scanning for uploads
- File size limits enforced

### Payment Security
- Use Paystack tokenization (PCI compliance)
- Never store raw card data
- Webhook signature verification (HMAC-SHA512)

---

## 7. Admin Dashboard Features (Comprehensive)

### User Management
- View all users with filters (role, join date, activity)
- Search users by email/name
- Edit user roles
- Suspend/reactivate accounts
- View user activity timeline

### Track Management
- View all tracks with status
- Approve/reject/archive tracks
- Add/edit track metadata
- View track analytics (plays, engagement)
- Bulk operations (approve multiple, archive old)

### Submission Reviews
- Queue of pending submissions
- Preview audio and cover art
- Accept/reject with feedback
- View submission payment status
- Artist communication interface

### Payment Management
- Transaction history with filters
- Revenue by type/period
- Subscription management
- Refund processing
- Export reports (CSV)

### Analytics
- Site overview: total tracks, users, artists
- Revenue metrics: total, monthly, per-track
- User growth charts
- Genre distribution
- Top tracks by plays/engagement

### Content Management
- Announcements/news posts
- Site sections visibility toggle
- Featured tracks selection
- Homepage customization

---

## 8. Implementation Priority

### Phase 1 (MVP)
1. Firestore schema setup
2. User authentication & profiles
3. Stripe basic integration
4. Simple track submission
5. Admin approval interface

### Phase 2 (Core Features)
1. Record label catalog page
2. Artist profile pages
3. Track discovery/search
4. Submission form with file upload
5. Basic admin dashboard

### Phase 3 (Advanced)
1. Analytics dashboard
2. Advanced admin features
3. Announcements system
4. User settings/preferences
5. email notifications

---

## 9. Tech Stack Summary

**Frontend**: Next.js 14 + TypeScript + Tailwind CSS + Framer Motion
**Backend**: Firebase (Auth, Firestore, Storage) + Cloud Functions (optional)
**Payments**: Stripe
**File Storage**: Firebase Storage
**Real-time**: Firestore listeners
**Forms**: React Hook Form + Zod validation

---

## Next Steps
1. Review and approve architecture
2. Create Firestore collections
3. Install Stripe SDK
4. Build authentication system
5. Create core UI components
6. Implement submission portal
7. Create admin dashboard
8. Test payment flows
