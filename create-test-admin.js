const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = JSON.parse(
  fs.readFileSync('/Users/admin/Documents/AIAIAI/New iancredible site 2026/service-account-key.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'iancredible-website'
});

const auth = admin.auth();
const db = admin.firestore();

async function createTestAdmin() {
  console.log('🔐 Creating test admin account...\n');
  
  const testEmail = 'test-admin@iancredible.com';
  const testPassword = 'TestAdmin123!@#';
  
  try {
    // Create Firebase Auth user
    const userRecord = await auth.createUser({
      email: testEmail,
      password: testPassword,
      displayName: 'Test Admin User',
    });
    
    console.log('✅ Firebase Auth user created');
    console.log('   UID:', userRecord.uid);
    
    // Create user profile in Firestore
    const userProfile = {
      uid: userRecord.uid,
      email: testEmail,
      displayName: 'Test Admin User',
      role: 'admin',
      subscriptionStatus: 'premium',
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
      onboardingComplete: true,
      preferences: {
        notifications: true,
        newsletter: false,
      },
    };
    
    await db.collection('users').doc(userRecord.uid).set(userProfile);
    console.log('✅ User profile saved to Firestore');
    
    // Verify it persisted
    const saved = await db.collection('users').doc(userRecord.uid).get();
    if (saved.exists) {
      console.log('✅ Data VERIFIED in Firestore\n');
    }
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('TEST ADMIN CREDENTIALS');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Email:    ${testEmail}`);
    console.log(`Password: ${testPassword}`);
    console.log(`UID:      ${userRecord.uid}`);
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('🌐 Test at: https://iancredible-wappsite-796662323239.us-central1.run.app\n');
    console.log('1. Click "Sign In"');
    console.log('2. Use the credentials above');
    console.log('3. Verify you reach the dashboard\n');
    console.log('✅ This proves data persistence works!');
    
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  } finally {
    await admin.app().delete();
  }
}

createTestAdmin().then(success => {
  process.exit(success ? 0 : 1);
});
