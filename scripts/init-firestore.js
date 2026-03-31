#!/usr/bin/env node

/**
 * Firestore Initialization Script
 * Creates collections and initializes with sample data for IANCREDIBLE platform
 * Run: node scripts/init-firestore.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'iancredible-website'
});

const db = admin.firestore();
const { Timestamp } = admin.firestore;

// Helper function to log progress
const log = (stage, message) => {
  console.log(`\n📋 [${stage}] ${message}`);
};

async function initializeFirestore() {
  try {
    log('START', 'Initializing Firestore collections...');

    // Create admin user
    log('USERS', 'Creating admin user...');
    await db.collection('users').doc('admin-uid-001').set({
      uid: 'admin-uid-001',
      email: 'admin@iancredible.com',
      displayName: 'IANCREDIBLE Admin',
      role: 'admin',
      avatar: 'https://via.placeholder.com/150?text=Admin',
      bio: 'Platform administrator for IANCREDIBLE Record Label',
      socialLinks: {
        twitter: 'https://twitter.com/iancredible',
        instagram: 'https://instagram.com/iancredible',
        spotify: 'https://spotify.com/artist/iancredible'
      },
      subscriptionStatus: 'premium',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      onboardingComplete: true,
      preferences: {
        notifications: true,
        newsletter: true
      }
    });

    // Create sample artist users
    log('USERS', 'Creating sample artist users...');
    const artistUsers = [
      {
        uid: 'artist-uid-001',
        email: 'iamian@iancredible.com',
        displayName: 'IAMIAN - Sonic Architect',
        role: 'artist',
        avatar: 'https://via.placeholder.com/150?text=IAMIAN',
        bio: 'Professional audio engineer and music producer. 40 years of excellence in audio production.',
        socialLinks: {
          spotify: 'https://open.spotify.com/artist/iamian',
          soundcloud: 'https://soundcloud.com/iamian'
        }
      },
      {
        uid: 'artist-uid-002',
        email: 'dieselgo@iancredible.com',
        displayName: 'Diesel GO - Tech Visionary',
        role: 'artist',
        avatar: 'https://via.placeholder.com/150?text=DieselGO',
        bio: 'Enterprise software architect and workflow automation expert.',
        socialLinks: {
          twitter: 'https://twitter.com/dieselgo',
          github: 'https://github.com/dieselgo'
        }
      }
    ];

    for (const artist of artistUsers) {
      await db.collection('users').doc(artist.uid).set({
        ...artist,
        subscriptionStatus: 'premium',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        onboardingComplete: true,
        preferences: {
          notifications: true,
          newsletter: true
        }
      });
    }

    // Create sample tracks
    log('TRACKS', 'Creating sample tracks...');
    const tracks = [
      {
        title: 'Cosmic Flow - Genesis',
        artistId: 'artist-uid-001',
        artistName: 'IAMIAN - Sonic Architect',
        coverArt: 'https://via.placeholder.com/300?text=Cosmic+Flow',
        audioUrl: 'https://example.com/audio/cosmic-flow-genesis.mp3',
        description: 'A journey through flowing particles and digital landscapes. Interactive audio experience.',
        genre: 'Electronic / Ambient',
        releaseDate: Timestamp.fromDate(new Date('2026-03-01')),
        status: 'published',
        distributionLinks: {
          spotify: 'https://open.spotify.com/track/example',
          appleMusic: 'https://music.apple.com/track/example'
        },
        stats: {
          plays: 1250,
          downloads: 342,
          likes: 156
        }
      },
      {
        title: 'Audio Mastery Series - Vol 1',
        artistId: 'artist-uid-001',
        artistName: 'IAMIAN - Sonic Architect',
        coverArt: 'https://via.placeholder.com/300?text=Audio+Mastery',
        audioUrl: 'https://example.com/audio/audio-mastery-vol1.mp3',
        description: 'Professional audio mixing and mastering techniques demonstrated.',
        genre: 'Tutorial / Educational',
        releaseDate: Timestamp.fromDate(new Date('2026-02-15')),
        status: 'published',
        stats: {
          plays: 3420,
          downloads: 892,
          likes: 567
        }
      },
      {
        title: 'Diesel Flow - Innovation',
        artistId: 'artist-uid-002',
        artistName: 'Diesel GO - Tech Visionary',
        coverArt: 'https://via.placeholder.com/300?text=Diesel+Flow',
        audioUrl: 'https://example.com/audio/diesel-flow-innovation.mp3',
        description: 'Enterprise workflow automation and digital transformation strategies.',
        genre: 'Tech / Business',
        releaseDate: Timestamp.fromDate(new Date('2026-03-10')),
        status: 'published',
        stats: {
          plays: 892,
          downloads: 234,
          likes: 145
        }
      }
    ];

    for (let i = 0; i < tracks.length; i++) {
      const trackRef = db.collection('tracks').doc();
      await trackRef.set({
        id: trackRef.id,
        ...tracks[i],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }

    // Create sample submissions
    log('SUBMISSIONS', 'Creating sample submissions...');
    const submissions = [
      {
        artistId: 'artist-uid-003',
        artistName: 'Rising Artist One',
        artistEmail: 'rising1@example.com',
        trackTitle: 'Emerging Talent - First Release',
        genre: 'Electronic',
        audioUrl: 'https://example.com/audio/submission-001.mp3',
        coverArtUrl: 'https://via.placeholder.com/300?text=Submission+001',
        bio: 'Emerging electronic music producer with focus on experimental sounds.',
        socialLinks: {
          instagram: 'https://instagram.com/risingartist1',
          soundcloud: 'https://soundcloud.com/risingartist1'
        },
        status: 'pending',
        submittedAt: Timestamp.fromDate(new Date('2026-03-25')),
        paymentStatus: 'free'
      },
      {
        artistId: 'artist-uid-004',
        artistName: 'Indie Producer Two',
        artistEmail: 'indie2@example.com',
        trackTitle: 'Independent Spirit',
        genre: 'Indie Pop',
        audioUrl: 'https://example.com/audio/submission-002.mp3',
        coverArtUrl: 'https://via.placeholder.com/300?text=Submission+002',
        bio: 'Independent producer creating authentic indie pop music.',
        socialLinks: {
          twitter: 'https://twitter.com/indieproducer2',
          spotify: 'https://open.spotify.com/artist/indie2'
        },
        status: 'approved',
        submittedAt: Timestamp.fromDate(new Date('2026-03-15')),
        reviewedAt: Timestamp.fromDate(new Date('2026-03-20')),
        reviewedBy: 'admin-uid-001',
        feedback: 'Great production quality. Approved for distribution.',
        paymentStatus: 'paid',
        paymentId: 'paystack_ref_12345'
      }
    ];

    for (let i = 0; i < submissions.length; i++) {
      const subRef = db.collection('submissions').doc();
      await subRef.set({
        id: subRef.id,
        ...submissions[i]
      });
    }

    // Create sample payments
    log('PAYMENTS', 'Creating sample payments...');
    const payments = [
      {
        userId: 'artist-uid-004',
        paystackPaymentId: 'paystack_ref_12345',
        paystackCustomerId: 'cus_indie2',
        amount: 10000, // R100.00 in kobo
        currency: 'ZAR',
        status: 'success',
        type: 'submission',
        relatedId: 'submission-002-id',
        createdAt: Timestamp.fromDate(new Date('2026-03-20')),
        metadata: {
          email: 'indie2@example.com',
          description: 'Track submission fee'
        }
      },
      {
        userId: 'artist-uid-001',
        paystackPaymentId: 'paystack_ref_67890',
        paystackCustomerId: 'cus_iamian',
        amount: 50000, // R500.00 in kobo (annual subscription)
        currency: 'ZAR',
        status: 'success',
        type: 'subscription',
        createdAt: Timestamp.fromDate(new Date('2026-03-01')),
        metadata: {
          email: 'iamian@iancredible.com',
          description: 'Annual premium subscription'
        }
      }
    ];

    for (let i = 0; i < payments.length; i++) {
      const payRef = db.collection('payments').doc();
      await payRef.set({
        id: payRef.id,
        ...payments[i],
        updatedAt: Timestamp.now()
      });
    }

    // Create announcements collection
    log('ANNOUNCEMENTS', 'Creating announcements...');
    const announcements = [
      {
        title: 'IANCREDIBLE Platform Launch',
        content: 'Welcome to the IANCREDIBLE Record Label Platform. We are excited to launch our new unified ecosystem.',
        author: 'admin-uid-001',
        type: 'announcement',
        priority: 'high',
        createdAt: Timestamp.fromDate(new Date('2026-03-20')),
        updatedAt: Timestamp.fromDate(new Date('2026-03-20')),
        published: true
      },
      {
        title: 'New Artist Submission Guidelines',
        content: 'Updated submission guidelines for independent artists. Please review before submitting your work.',
        author: 'admin-uid-001',
        type: 'guideline',
        priority: 'medium',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        published: true
      }
    ];

    for (let i = 0; i < announcements.length; i++) {
      const annRef = db.collection('announcements').doc();
      await annRef.set({
        id: annRef.id,
        ...announcements[i]
      });
    }

    // Create settings collection
    log('SETTINGS', 'Creating platform settings...');
    await db.collection('settings').doc('platform').set({
      platformName: 'IANCREDIBLE',
      platformUrl: 'https://iancredible.com',
      submissionFeeZAR: 100,
      annualSubscriptionFeeZAR: 500,
      supportEmail: 'support@iancredible.com',
      timezone: 'Africa/Johannesburg',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    log('SUCCESS', '✅ Firestore initialization complete!');
    console.log('\n📊 Summary:');
    console.log('  ✓ Users collection: 3 documents (1 admin, 2 artists)');
    console.log('  ✓ Tracks collection: 3 documents');
    console.log('  ✓ Submissions collection: 2 documents');
    console.log('  ✓ Payments collection: 2 documents');
    console.log('  ✓ Announcements collection: 2 documents');
    console.log('  ✓ Settings collection: 1 document');
    console.log('\n🎉 Your database is ready to go!');

    process.exit(0);
  } catch (error) {
    log('ERROR', `Failed to initialize Firestore: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run initialization
initializeFirestore();
