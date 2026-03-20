#!/usr/bin/env node

/**
 * Unified Cosmic Flow Cloud Run Deployment Script
 * 
 * This script handles the complete deployment of Cosmic Flow to Google Cloud Run:
 * 1. Validates prerequisites (gcloud, authentication, project)
 * 2. Deploys the Express/WebSocket server to Cloud Run
 * 3. Extracts the service URL
 * 4. Updates environment files
 * 5. Optionally rebuilds and redeploys the portfolio
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  projectId: 'iancredible-website',
  serviceName: 'cosmic-flow-server',
  region: 'us-central1',
  sourceDir: './app/cosmic-flow',
  memory: '512Mi',
  cpu: '1',
  maxInstances: '100',
};

// ANSI colors for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ${message}`, 'red');
  process.exit(1);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function section(title) {
  console.log();
  log(`${'='.repeat(60)}`, 'yellow');
  log(`  ${title}`, 'bright');
  log(`${'='.repeat(60)}`, 'yellow');
  console.log();
}

function runCommand(command, options = {}) {
  try {
    info(`Running: ${command}`);
    return execSync(command, {
      stdio: 'pipe',
      encoding: 'utf8',
      ...options,
    });
  } catch (err) {
    return null;
  }
}

function runCommandVerbose(command, options = {}) {
  try {
    return execSync(command, {
      stdio: 'inherit',
      encoding: 'utf8',
      ...options,
    });
  } catch (err) {
    throw err;
  }
}

// Check prerequisites
function checkPrerequisites() {
  section('Step 1: Checking Prerequisites');

  // Check gcloud
  try {
    const version = runCommand('gcloud --version 2>&1');
    if (!version) throw new Error('gcloud not found');
    success('gcloud CLI found');
  } catch {
    error('gcloud CLI not found. Install with: brew install --cask google-cloud-sdk');
  }

  // Check authentication
  try {
    const account = runCommand('gcloud auth list --filter=status:ACTIVE --format="value(account)"');
    if (!account) throw new Error('Not authenticated');
    success(`Authenticated as: ${account.trim()}`);
  } catch {
    error('Not authenticated. Run: gcloud auth login');
  }

  // Check project
  try {
    const project = runCommand(`gcloud config get-value project`);
    if (project && project.trim() === config.projectId) {
      success(`Project set to: ${config.projectId}`);
    } else {
      info(`Setting project to: ${config.projectId}`);
      runCommand(`gcloud config set project ${config.projectId}`);
      success(`Project set to: ${config.projectId}`);
    }
  } catch {
    error(`Cannot access project: ${config.projectId}`);
  }

  // Check source directory
  if (!fs.existsSync(config.sourceDir)) {
    error(`Source directory not found: ${config.sourceDir}`);
  }
  success(`Source directory found: ${config.sourceDir}`);

  // Check Dockerfile
  const dockerfilePath = path.join(config.sourceDir, 'Dockerfile');
  if (!fs.existsSync(dockerfilePath)) {
    error(`Dockerfile not found in: ${config.sourceDir}`);
  }
  success('Dockerfile found');
}

// Deploy to Cloud Run
function deployToCloudRun() {
  section('Step 2: Deploying to Google Cloud Run');

  info(`Deploying ${config.serviceName} to Cloud Run...`);
  info('This may take 2-5 minutes for the first deployment.');

  try {
    const command = [
      'gcloud run deploy',
      config.serviceName,
      `--source ${config.sourceDir}`,
      '--platform managed',
      `--region ${config.region}`,
      '--allow-unauthenticated',
      `--set-env-vars NODE_ENV=production`,
      `--port 3000`,
      `--memory ${config.memory}`,
      `--cpu ${config.cpu}`,
      `--max-instances ${config.maxInstances}`,
      `--project ${config.projectId}`,
      '--quiet',
    ].join(' ');

    runCommandVerbose(command);
    success('Cloud Run deployment completed');
  } catch (err) {
    error(`Deployment failed: ${err.message}`);
  }
}

// Get Cloud Run URL
function getCloudRunUrl() {
  section('Step 3: Retrieving Service URL');

  try {
    const url = runCommand(
      `gcloud run services describe ${config.serviceName} --region ${config.region} --format="value(status.url)"`
    );

    if (!url) throw new Error('Could not retrieve service URL');

    const cloudRunUrl = url.trim();
    success(`Cloud Run Service URL:\n${colors.bright}${cloudRunUrl}${colors.reset}`);
    return cloudRunUrl;
  } catch (err) {
    error(`Failed to retrieve service URL: ${err.message}`);
  }
}

// Update environment files
function updateEnvironmentFiles(cloudRunUrl) {
  section('Step 4: Updating Environment Variables');

  const envFiles = ['.env.local', '.env.production'];
  const envVariable = `NEXT_PUBLIC_COSMIC_FLOW_URL=${cloudRunUrl}`;

  for (const envFile of envFiles) {
    if (!fs.existsSync(envFile)) {
      info(`Creating ${envFile}...`);
      fs.writeFileSync(envFile, '');
    }

    let content = fs.readFileSync(envFile, 'utf8');

    // Remove old COSMIC_FLOW_URL line if it exists
    content = content.replace(/NEXT_PUBLIC_COSMIC_FLOW_URL=.*\n?/g, '');

    // Add new URL
    if (!content.endsWith('\n')) content += '\n';
    content += `${envVariable}\n`;

    fs.writeFileSync(envFile, content);
    success(`Updated ${envFile}`);
  }
}

// Optional: Rebuild portfolio
function askToRebuildPortfolio() {
  section('Step 5: Portfolio Rebuild (Optional)');

  const answer = process.argv.includes('--auto') ? 'y' : 'n';

  if (answer.toLowerCase() === 'y') {
    info('Rebuilding portfolio...');
    try {
      runCommandVerbose('npm run build');
      success('Portfolio rebuild complete');

      info('Deploying to Firebase Hosting...');
      runCommandVerbose('firebase deploy --only hosting');
      success('Firebase deployment complete');
    } catch (err) {
      log('⚠️  Portfolio rebuild failed. You can do it manually later:', 'yellow');
      log('   npm run build && firebase deploy --only hosting', 'yellow');
    }
  } else {
    log('\n📝 To rebuild and redeploy your portfolio manually:', 'yellow');
    log('   npm run build', 'yellow');
    log('   firebase deploy --only hosting\n', 'yellow');
  }
}

// Print summary
function printSummary(cloudRunUrl) {
  section('✨ Deployment Summary');

  console.log(`
${colors.bright}Service Details:${colors.reset}
  Service Name: ${colors.blue}${config.serviceName}${colors.reset}
  Project:      ${colors.blue}${config.projectId}${colors.reset}
  Region:       ${colors.blue}${config.region}${colors.reset}
  URL:          ${colors.blue}${cloudRunUrl}${colors.reset}

${colors.bright}Configuration:${colors.reset}
  Memory:       ${colors.blue}${config.memory}${colors.reset}
  CPU:          ${colors.blue}${config.cpu}${colors.reset}
  Max Instances: ${colors.blue}${config.maxInstances}${colors.reset}

${colors.bright}Environment Variables:${colors.reset}
  NODE_ENV=production
  NEXT_PUBLIC_COSMIC_FLOW_URL=${cloudRunUrl}

${colors.bright}Next Steps:${colors.reset}
  1. The Cosmic Flow server is now live! 🚀
  2. Environment files (.env.local, .env.production) have been updated
  3. Rebuild your portfolio if needed:
     npm run build && firebase deploy --only hosting

${colors.bright}Monitoring:${colors.reset}
  View logs:     gcloud run logs read ${config.serviceName} --region ${config.region}
  View status:   gcloud run describe ${config.serviceName} --region ${config.region}
  Test service:  curl ${cloudRunUrl}/

${colors.bright}Support:${colors.reset}
  See DEPLOYMENT_COSMIC_FLOW.md for more details and troubleshooting.
  `);
}

// Main execution
async function main() {
  try {
    log('\n🚀 Cosmic Flow - Cloud Run Deployment\n', 'bright');

    checkPrerequisites();
    deployToCloudRun();
    const cloudRunUrl = getCloudRunUrl();
    updateEnvironmentFiles(cloudRunUrl);
    askToRebuildPortfolio();
    printSummary(cloudRunUrl);

    success('\nDeployment complete! Your Cosmic Flow is live! 🎉');
  } catch (err) {
    error(`Unexpected error: ${err.message}`);
  }
}

main();
