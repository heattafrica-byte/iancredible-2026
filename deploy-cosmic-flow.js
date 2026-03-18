#!/usr/bin/env node

/**
 * Deploy Cosmic Flow to Google Cloud Run
 * Uses service account credentials already in place for Firebase
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const PROJECT_ID = 'iancredible-website';
const SERVICE_NAME = 'cosmic-flow-server';
const REGION = 'us-central1';
const SERVICE_ACCOUNT_KEY = path.join(__dirname, 'service-account-key.json');

console.log('🚀 Deploying Cosmic Flow Server to Cloud Run...\n');

// Step 1: Check authentication
console.log('Step 1: Setting up authentication...');
process.env.GOOGLE_APPLICATION_CREDENTIALS = SERVICE_ACCOUNT_KEY;

if (!fs.existsSync(SERVICE_ACCOUNT_KEY)) {
  console.error('❌ Error: service-account-key.json not found');
  process.exit(1);
}

// Step 2: Build and push Docker image
console.log('\nStep 2: Building Docker image...');
const buildCmd = `docker build -t gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest app/cosmic-flow/`;

exec(buildCmd, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Docker build failed:');
    console.error(stderr);
    process.exit(1);
  }
  
  console.log('✅ Docker image built successfully');
  
  // Step 3: Configure Docker authentication
  console.log('\nStep 3: Configuring Docker authentication...');
  const authCmd = `gcloud auth activate-service-account --key-file=${SERVICE_ACCOUNT_KEY} --project=${PROJECT_ID}`;
  
  exec(authCmd, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Authentication failed. Please ensure gcloud CLI is installed:');
      console.error('   brew install google-cloud-sdk');
      console.error(stderr);
      process.exit(1);
    }
    
    // Step 4: Push image
    console.log('Pushing image to Google Container Registry...');
    const pushCmd = `docker push gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest`;
    
    exec(pushCmd, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Docker push failed:');
        console.error(stderr);
        process.exit(1);
      }
      
      console.log('✅ Image pushed successfully');
      
      // Step 5: Deploy to Cloud Run
      console.log('\nStep 4: Deploying to Cloud Run...');
      const deployCmd = `gcloud run deploy ${SERVICE_NAME} \
        --image gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest \
        --platform managed \
        --region ${REGION} \
        --project ${PROJECT_ID} \
        --allow-unauthenticated \
        --port 3000 \
        --set-env-vars NODE_ENV=production`;
      
      exec(deployCmd, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Cloud Run deployment failed:');
          console.error(stderr);
          process.exit(1);
        }
        
        // Extract the Cloud Run URL
        const urlMatch = stdout.match(/Service URL: (https:\/\/[^\s]+)/);
        if (urlMatch) {
          const cloudRunUrl = urlMatch[1];
          console.log('\n✅ Deployment successful!\n');
          console.log(`🎉 Your Cosmic Flow server is live!`);
          console.log(`📍 URL: ${cloudRunUrl}\n`);
          console.log('Next steps:');
          console.log(`1. Update NEXT_PUBLIC_COSMIC_FLOW_URL in your environment:`); 
          console.log(`   NEXT_PUBLIC_COSMIC_FLOW_URL=${cloudRunUrl}\n`);
          console.log('2. Rebuild and deploy your portfolio:');
          console.log('   npm run build && firebase deploy --only hosting\n');
        }
      });
    });
  });
});
