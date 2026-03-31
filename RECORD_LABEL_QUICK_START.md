# Record Label Platform - Quick Reference Guide

## 📍 Key Routes & URLs

### Public Pages
- `/` - Home page
- `/record-label` - Browse all released tracks
- `/record-label/[trackId]` - View individual track
- `/record-label/artist/[artistId]` - Artist profile page

### Authentication
- `/auth/login` - User login
- `/auth/signup` - Create new account

### User Dashboard
- `/dashboard` - User dashboard
- `/dashboard/profile` - Edit profile & settings

### Artist Features
- `/submit/track` - Submit a track for review

### Admin Panel (Accessible only to admin users)
- `/admin/dashboard` - Admin overview & quick links
- `/admin/users` - Manage all users
- `/admin/submissions` - Review & approve/reject submissions
- `/admin/tracks` - Manage published tracks
- `/admin/payments` - View payment history & revenue
- `/admin/announcements` - Create/manage release announcements
- `/admin/analytics` - View detailed analytics

### API Endpoints
- `GET /api/health` - API health check
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/webhooks/stripe` - Stripe webhook receiver

---

## 👤 User Roles & Permissions

### Member (Default)
- Browse tracks
- View artist profiles
- Create account & profile
- Cannot submit tracks

### Artist
- All member permissions +
- Submit tracks ($10 fee)
- View own submissions
- See published tracks
- View track analytics

### Admin (You)
- Full access to all features
- User management (view, edit, suspend)
- Submission review & approval
- Track management
- Payment & revenue monitoring
- Announcements management
- Analytics dashboard
- All configuration settings

---

## 🎵 Feature Overview

### Record Label Catalog
- Browse all published tracks
- Filter by genre
- Search functionality
- Audio player
- Artist information
- Play count tracking

### Artist Submission System
- Upload track (MP3, WAV, etc.)
- Upload cover art
- Provide description & bio
- Share social links
- $10 submission fee via Stripe
- Track submission status
- Admin approval workflow

### User Profiles
- Display name & bio
- Social media links (Twitter, Instagram, Spotify)
- Profile picture/avatar
- Created tracks (for artists)
- Activity history

### Admin Dashboard
Complete platform management:
- **Users**: Add/edit/remove users, change roles
- **Submissions**: Review & approve tracks with feedback
- **Tracks**: Manage published content (edit, archive, delete)
- **Payments**: View all transactions, revenue by type
- **Announcements**: Promote upcoming releases
- **Analytics**: Track platform metrics & performance

### Payment Processing
- Stripe integration for secure payments
- Payment intent creation
- Webhook handling for confirmations
- Transaction tracking
- Revenue reporting

---

## 🔐 Security Features

### Authentication
- Firebase Authentication (email/password)
- Secure password handling
- Session management
- Token-based auth

### Authorization
- Role-based access control (RBAC)
- Column-level permissions
- Protected routes
- Admin-only endpoints

### Data Protection
- Firestore security rules
- Cloud Storage security rules
- HTTPS for all communications
- PCI compliance via Stripe

---

## 📊 Admin Dashboard Metrics

The admin dashboard displays:
- **Total Users** - All registered accounts
- **Artists** - Users with artist role
- **Tracks Released** - Published tracks in catalog
- **Pending Reviews** - Waiting for approval
- **Total Revenue** - Sum of successful payments

### Analytics Available
- Genre distribution chart
- Revenue breakdown by payment type
- Top track statistics
- User growth metrics
- Track engagement metrics

---

## 💳 Stripe Integration Details

### Payment Types
1. **Track Submission** ($10)
   - Artists submit tracks for review
   - Payment required before review
   - Covers admin costs

2. **Premium Subscription** (Future)
   - Unlimited submissions
   - Early access to features
   - Artist dashboard

### Payment Flow
1. Artist submits track
2. Create Stripe Payment Intent
3. Collect payment via Stripe Elements
4. Webhook confirms payment
5. Admin reviews and approves/rejects
6. If approved, track published

### Test Cards (Development)
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: Use any card + OTP

---

## 📁 Project Structure

```
app/
├── auth/                 # Authentication pages
│   ├── login/
│   └── signup/
├── dashboard/            # User dashboard
│   └── profile/
├── record-label/         # Public catalog
│   ├── [trackId]/
│   └── artist/[artistId]/
├── submit/              # Artist submission
│   └── track/
├── admin/               # Admin only
│   ├── dashboard/
│   ├── users/
│   ├── submissions/
│   ├── tracks/
│   ├── payments/
│   ├── announcements/
│   └── analytics/
├── api/                 # Backend endpoints
│   ├── payments/
│   ├── webhooks/
│   └── health/
├── layout.tsx           # Root layout with AuthProvider
└── page.tsx            # Home page

lib/
├── auth-context.tsx     # User authentication context
├── firestore-utils.ts   # Database operations
├── stripe-utils.ts      # Payment processing
├── permissions.ts       # Role-based access control
└── firebase.ts         # Firebase config

hooks/
└── useProtectedRoute.ts # Protected route utilities
```

---

## 🚀 Getting Started Checklist

- [ ] Configure environment variables (.env.local)
- [ ] Set up Firebase Firestore collections
- [ ] Enable Cloud Storage
- [ ] Create Stripe account
- [ ] Set Firestore security rules
- [ ] Set Cloud Storage rules
- [ ] Create admin account
- [ ] Test login flow
- [ ] Test artist submission
- [ ] Review submission in admin panel
- [ ] Test payment flow with Stripe test card
- [ ] Deploy to production

---

## 🔗 External Resources

- **Firebase Console**: https://console.firebase.google.com
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Next.js Docs**: https://nextjs.org/docs
- **Firestore Docs**: https://firebase.google.com/docs/firestore
- **Stripe Docs**: https://stripe.com/docs

---

## 💬 Common Questions

**Q: How do artists get paid?**
A: Currently, this system collects submission fees. You can manually send payments to artists or integrate a payout system.

**Q: Can I change the submission fee?**
A: Yes, modify the amount in `/app/submit/track/page.tsx` (currently $10).

**Q: How do I make someone an admin?**
A: Edit their user document in Firestore and change role to "admin".

**Q: Can members submit without paying?**
A: No - you'd need to modify the checkout flow. Current: Members can only submit as artists ($10 fee).

**Q: How are tracks moderated?**
A: All submissions go to admin queue. Admin reviews and decides to approve or reject.

**Q: Can I white label this?**
A: Yes - update colors in Tailwind config, customize components, update text branding.

---

## 📞 Support & Maintenance

### Regular Tasks
- Check pending submissions in admin panel
- Review payment reports
- Monitor user growth in analytics
- Update announcements for new releases
- Moderate user content if needed

### Monitoring
- Firebase usage dashboards
- Stripe transaction history
- Error logs in browser console
- Firestore quota alerts

### Updates
- Keep npm packages updated: `npm update`
- Monitor Firebase feature deprecations
- Stay current with Stripe API changes
