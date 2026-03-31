#!/usr/bin/env node

/**
 * Deploy Firestore Rules using Firebase Admin Admin SDK
 * Workaround for Firebase CLI authentication issues
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'iancredible-website'
});

async function deployRulesViaREST() {
  try {
    console.log('📋 Deploying Firestore Rules via REST API...');
    
    // Read the dev rules file
    const rulesPath = path.join(__dirname, '../firestore.rules.dev');
    const rulesContent = fs.readFileSync(rulesPath, 'utf8');
    
    console.log('✓ Rules file loaded (dev rules)');
    
    // Get access token
    const GoogleAuth = require('google-auth-library');
    const auth = new GoogleAuth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      keyFile: path.join(__dirname, '../service-account-key.json')
    });
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    
    // Publish the rules
    const url = 'https://firestore.googleapis.com/v1/projects/iancredible-website/databases/default/rules';
    
    const https = require('https');
    const deployPayload = {
      source: {
        files: [
          {
            name: 'firestore.rules',
            content: rulesContent
          }
        ]
      }
    };
    
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'firestore.googleapis.com',
        path: '/v1/projects/iancredible-website/databases/default/rules',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken.token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(deployPayload))
        }
      };
      
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log('✅ Rules deployed successfully!');
            console.log('\n✓ Your Firestore is now ready to use');
            console.log('✓ Public read access enabled for: tracks, announcements, settings');
            console.log('✓ Authenticated access for: users, submissions, payments');
            resolve();
          } else {
            reject(new Error(`API returned status ${res.statusCode}: ${data}`));
          }
        });
      });
      
      req.on('error', reject);
      req.write(JSON.stringify(deployPayload));
      req.end();
    });
    
  } catch (error) {
    console.error('❌ Error deploying rules:', error.message);
    console.log('\n📚 Fallback: Deploy manually via Firebase Console:');
    console.log('1. Go to: https://console.firebase.google.com/project/iancredible-website/firestore/rules');
    console.log('2. Copy content from: firestore.rules.dev');
    console.log('3. Paste into Firebase Rules editor');
    console.log('4. Click Publish');
    throw error;
  }
}

deployRulesViaREST()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
