#!/usr/bin/env node

/**
 *Deploy Cosmic Flow to Google Cloud Run usingCloud Build
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const https = require('https');

const PROJECT_ID = 'iancredible-website';
const SERVICE_ACCOUNT_KEY_FILE = './service-account-key.json';

async function runCommand(cmd, args, options = {}) {
  return new Promise((resolve, reject) => {
    const result = spawnSync(cmd, args, {
      cwd: options.cwd || process.cwd(),
      encoding: 'utf8',
      stdio: 'pipe',
      ...options
    });

    if (result.error) {
      reject(result.error);
    } else if (result.status !== 0) {
      reject(new Error(`Command failed: ${result.stderr || result.stdout}`));
    } else {
      resolve(result.stdout + (result.stderr || ''));
    }
  });
}

async function getAuthToken() {
  // Use gcloud auth application-default print-access-token if available
  try {
    const output = spawnSync('gcloud', ['auth', 'application-default', 'print-access-token'], {
      encoding: 'utf8'
    });
    if (output.status === 0) {
      return output.stdout.trim();
    }
  } catch (e) {
    console.log('Note: gcloud not fully configured, using alternative method...');
  }

  // Fallback: use service account directly
  try {
    const keyContent = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_KEY_FILE, 'utf8'));
    console.log('Using service account from:', SERVICE_ACCOUNT_KEY_FILE);
    return `ya29.mock-token-for-${keyContent.client_email}`;
  } catch (e) {
    throw new Error('Could not get authentication token');
  }
}

async function deployViaCloudBuild() {
  console.log('Attempting to deploy Cosmic Flow...\n');

  // First, make sure gcloud is installed
  try {
    const output = spawnSync('gcloud', ['--version'], { encoding: 'utf8' });
    if (output.status === 0) {
      console.log('✓ gcloud CLI found');
      console.log(output.stdout);
    }
  } catch (e) {
    console.error('✗ gcloud CLI not found');
    console.error('\nInstalling gcloud CLI via Homebrew...');
    
    const installResult = spawnSync('brew', ['install', 'google-cloud-sdk'], {
      stdio: 'inherit'
    });

    if (installResult.status !== 0) {
      console.error('\n✗ Failed to install gcloud via Homebrew');
      console.error('Please install manually:');
      console.error('  brew install google-cloud-sdk\n');
      return false;
    }
    console.log('✓ gcloud CLI installed');
  }

  // Configure gcloud with service account
  console.log('\nConfiguring gcloud with service account...');
  try {
    await runCommand('gcloud', ['auth', 'activate-service-account', '--key-file=' + SERVICE_ACCOUNT_KEY_FILE]);
    console.log('✓ Service account activated');
  } catch (e) {
    console.error('✗ Failed to activate service account:', e.message);
    return false;
  }

  // Set project
  console.log('\nSetting GCP project...');
  try {
    await runCommand('gcloud', ['config', 'set', 'project', PROJECT_ID]);
    console.log(`✓ Project set to ${PROJECT_ID}`);
  } catch (e) {
    console.error('✗ Failed to set project:', e.message);
    return false;
  }

  // Deploy to Cloud Run
  console.log('\nDeploying to Cloud Run...');
  console.log('This may take 2-5 minutes...\n');

  try {
    const deployOutput = await runCommand('gcloud', [
      'run', 'deploy', 'cosmic-flow-server',
      '--source', './app/cosmic-flow',
      '--platform', 'managed',
      '--region', 'us-central1',
      '--allow-unauthenticated',
      '--set-env-vars', 'NODE_ENV=production',
      '--port', '3000',
      '--project', PROJECT_ID
    ], { cwd: process.cwd() });

    console.log(deployOutput);

    // Extract the service URL
    const urlMatch = deployOutput.match(/https:\/\/[^\s]+\.run\.app/);
    if (urlMatch) {
      return urlMatch[0];
    }

    // If URL not found in output, query the service directly
    console.log('\nQuerying Cloud Run service...');
    const describeOutput = await runCommand('gcloud', [
      'run', 'describe', 'cosmic-flow-server',
      '--region', 'us-central1',
      '--format', 'value(status.url)'
    ]);

    return describeOutput.trim();
  } catch (e) {
    console.error('✗ Deployment failed:', e.message);
    return null;
  }
}

async function updatePortfolioAndRedeploy(cosmicFlowUrl) {
  console.log(`\n${'='.repeat(60)}`);
  console.log('✓ Cloud Run Service Deployed!');
  console.log(`${'='.repeat(60)}`);
  console.log(`\nService URL: ${cosmicFlowUrl}\n`);

  // Update .env.production
  console.log('Updating portfolio environment...');
  let envContent = '';

  if (fs.existsSync('.env.production')) {
    envContent = fs.readFileSync('.env.production', 'utf8');
    // Remove old cosmic flow URL line if it exists
    envContent = envContent.replace(/NEXT_PUBLIC_COSMIC_FLOW_URL=.+\n?/g, '');
  }

  // Add new URL
  if (!envContent.endsWith('\n')) {
    envContent += '\n';
  }
  envContent += `NEXT_PUBLIC_COSMIC_FLOW_URL=${cosmicFlowUrl}\n`;

  fs.writeFileSync('.env.production', envContent);
  console.log('✓ Updated .env.production\n');

  // Rebuild portfolio
  console.log('Rebuilding portfolio...');
  try {
    await runCommand('npm', ['run', 'build']);
    console.log('✓ Build successful\n');
  } catch (e) {
    console.error('✗ Build failed:', e.message);
    return false;
  }

  // Deploy to Firebase
  console.log('Deploying to Firebase Hosting...');
  try {
    const firebaseOutput = await runCommand('firebase', [
      'deploy', '--only', 'hosting',
      '--non-interactive'
    ], {
      env: {
        ...process.env,
        GOOGLE_APPLICATION_CREDENTIALS: SERVICE_ACCOUNT_KEY_FILE
      }
    });

    console.log(firebaseOutput);
    return true;
  } catch (e) {
    console.error('✗ Firebase deployment failed:', e.message);
    return false;
  }
}

async function main() {
  try {
    const cosmicFlowUrl = await deployViaCloudBuild();

    if (!cosmicFlowUrl) {
      console.error('\nDeployment failed. Please try manual deployment:');
      console.error('  cd app/cosmic-flow');
      console.error('  gcloud run deploy cosmic-flow-server --source . --platform managed --allow-unauthenticated\n');
      process.exit(1);
    }

    const success = await updatePortfolioAndRedeploy(cosmicFlowUrl);

    if (success) {
      console.log('\n' + '='.repeat(60));
      console.log('✓ FULL DEPLOYMENT COMPLETE!');
      console.log('='.repeat(60));
      console.log(`\nCosmic Flow Backend: ${cosmicFlowUrl}`);
      console.log('Portfolio: https://iancredible-website.web.app/');
      console.log('\nYour Cosmic Flow experience is now live!\n');
    } else {
      console.error('\n✗ Portfolio update failed');
      console.error(`\nManual fix - Update .env.production with:`);
      console.error(`NEXT_PUBLIC_COSMIC_FLOW_URL=${cosmicFlowUrl}`);
      console.error('\nThen run: npm run build && firebase deploy --only hosting\n');
      process.exit(1);
    }
  } catch (e) {
    console.error('\n✗ Unexpected error:', e.message);
    process.exit(1);
  }
}

main();
