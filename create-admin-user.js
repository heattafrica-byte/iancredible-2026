// This script creates an admin user document in Firestore
// Usage: node create-admin-user.js

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'iancredible-website'
});

const db = admin.firestore();

async function createAdminUser() {
  try {
    const uid = 'olIJl3dG0hRUOyrO6VObEqgrqbb2';
    const email = 'iancrediblemusic@gmail.com';

    const userRef = db.collection('users').doc(uid);
    
    await userRef.set({
      uid: uid,
      email: email,
      displayName: 'Ian',
      role: 'admin',
      avatar: '/images/street-art-portrait.png',
      bio: 'Creator & Producer',
      subscriptionStatus: 'premium',
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
      onboardingComplete: true,
      preferences: {
        notifications: true,
        newsletter: true
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('UID:', uid);
    console.log('Email:', email);
    console.log('Role: admin');
    console.log('\nYou can now login at: https://iancredible-portfolio-796662323239.us-central1.run.app/auth/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
