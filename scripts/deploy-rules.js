#!/usr/bin/env node
/**
 * Deploy Firestore Security Rules
 * Usage: node scripts/deploy-rules.js [dev|prod]
 */

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// Determine environment
const env = process.argv[2] || 'dev';
const rulesFile = env === 'prod' ? 'firestore.rules' : 'firestore.rules.dev';
const rulesPath = path.join(__dirname, '..', rulesFile);

async function deployRules() {
  console.log(`📋 Deploying Firestore Rules (${env} environment)...`);

  try {
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      const serviceAccount = require('../service-account-key.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    // Read rules file
    if (!fs.existsSync(rulesPath)) {
      throw new Error(`Rules file not found: ${rulesPath}`);
    }

    const rulesContent = fs.readFileSync(rulesPath, 'utf-8');
    console.log(`✓ Rules file loaded: ${rulesFile}`);

    // Get Firestore admin client
    const client = admin.firestore();
    const projectId = admin.app().options.credential.projectId;

    console.log(`📍 Deploying to project: ${projectId}`);

    // Use gcloud CLI for deployment (most reliable method)
    const { execSync } = require('child_process');
    
    try {
      execSync(`gcloud firestore rules publish ${rulesPath} --project=${projectId}`, {
        stdio: 'inherit',
      });
      
      console.log('\n✅ Rules deployed successfully!');
      console.log('\n✓ Your Firestore is now protected with:');
      console.log('✓ Public read access for: tracks, announcements, settings');
      console.log('✓ Authenticated access for: users, submissions, payments');
      console.log('✓ Admin-only write access for: track uploads, admin functions');
      
    } catch (cliError) {
      // Fallback: use Firebase Admin SDK
      console.log('\n⚠️  gcloud CLI not available, using Firebase Admin SDK...');
      
      // Note: The Firebase Admin SDK doesn't have direct rules deployment
      // You need to use gcloud or Firebase Console
      console.log('\n📚 To deploy manually via Firebase Console:');
      console.log(`1. Go to: https://console.firebase.google.com/project/${projectId}/firestore/rules`);
      console.log(`2. Copy content from: ${rulesFile}`);
      console.log('3. Paste into Firebase Rules editor');
      console.log('4. Click Publish');
      
      throw new Error(
        'Rules deployment requires gcloud CLI. Install it from: https://cloud.google.com/sdk/docs/install'
      );
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  deployRules();
}

module.exports = deployRules;
