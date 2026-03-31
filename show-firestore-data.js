const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = JSON.parse(
  fs.readFileSync('./service-account-key.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'iancredible-website'
});

const db = admin.firestore();

async function showAllData() {
  console.log('\n📊 ============================================');
  console.log('   FIRESTORE DATABASE CONTENTS');
  console.log('============================================\n');
  
  try {
    // Get all users
    const usersSnap = await db.collection('users').get();
    console.log(`👥 USERS COLLECTION (${usersSnap.size} documents):`);
    console.log('─'.repeat(50));
    
    usersSnap.forEach(doc => {
      const data = doc.data();
      console.log(`\n  📄 Document ID: ${doc.id}`);
      console.log(`     Email: ${data.email}`);
      console.log(`     Name: ${data.displayName}`);
      console.log(`     Role: ${data.role}`);
      console.log(`     Subscribed: ${data.subscriptionStatus}`);
      console.log(`     Created: ${data.createdAt.toDate()}`);
    });
    
    // Get all tracks
    const tracksSnap = await db.collection('tracks').get();
    console.log(`\n\n🎵 TRACKS COLLECTION (${tracksSnap.size} documents):`);
    console.log('─'.repeat(50));
    
    tracksSnap.forEach(doc => {
      const data = doc.data();
      console.log(`\n  📄 Document ID: ${doc.id}`);
      console.log(`     Title: ${data.title}`);
      console.log(`     Artist: ${data.artistId}`);
      console.log(`     Genre: ${data.genre}`);
    });
    
    // Get all submissions
    const subsSnap = await db.collection('submissions').get();
    console.log(`\n\n📤 SUBMISSIONS COLLECTION (${subsSnap.size} documents):`);
    console.log('─'.repeat(50));
    
    subsSnap.forEach(doc => {
      const data = doc.data();
      console.log(`\n  📄 Document ID: ${doc.id}`);
      console.log(`     Title: ${data.trackTitle}`);
      console.log(`     Artist: ${data.artistName}`);
      console.log(`     Status: ${data.status}`);
      console.log(`     Submitted: ${data.submittedAt.toDate()}`);
    });
    
    console.log(`\n📊 ============================================`);
    console.log(`🌐 View all this in Firebase Console at:`);
    console.log(`https://console.firebase.google.com/project/iancredible-website/firestore/data\n`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await admin.app().delete();
  }
}

showAllData();
