const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Initialize Firebase Admin
const serviceAccount = require('../service-account-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'iancredible-website'
});

async function getAccessToken() {
  return new Promise((resolve, reject) => {
    const jwtClient = new (require('google-auth-library').JWT)({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    jwtClient.authorize((err, tokens) => {
      if (err) reject(err);
      else resolve(tokens.access_token);
    });
  });
}

async function deployRules() {
  try {
    const rulesPath = path.join(__dirname, '../firestore.rules.dev');
    const rulesContent = fs.readFileSync(rulesPath, 'utf8');
    
    console.log('📋 Deploying Firestore rules...');
    
    // Get access token
    const token = await getAccessToken();
    
    // First create a ruleset
    const projectId = 'iancredible-website';
    const createUrl = `https://firebaserules.googleapis.com/v1/projects/${projectId}/rulesets`;
    
    const createPayload = JSON.stringify({
      source: {
        files: [{
          name: 'firestore.rules',
          content: rulesContent
        }]
      }
    });
    
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'firebaserules.googleapis.com',
        port: 443,
        path: `/v1/projects/${projectId}/rulesets`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(createPayload)
        }
      };
      
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            const result = JSON.parse(data);
            console.log('✓ Ruleset created:', result.name);
            
            // Now release it
            const releaseUrl = `https://firebaserules.googleapis.com/v1/projects/${projectId}/releases`;
            const releasePayload = JSON.stringify({
              name: `projects/${projectId}/releases/cloud.firestore`,
              rulesetName: result.name
            });
            
            const releaseOptions = {
              hostname: 'firebaserules.googleapis.com',
              port: 443,
              path: `/v1/projects/${projectId}/releases`,
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(releasePayload)
              }
            };
            
            const releaseReq = https.request(releaseOptions, (releaseRes) => {
              let releaseData = '';
              releaseRes.on('data', chunk => releaseData += chunk);
              releaseRes.on('end', () => {
                if (releaseRes.statusCode === 200) {
                  console.log('✅ Rules released successfully!');
                  console.log('\n✓ Your Firestore is now accessible from the app');
                  process.exit(0);
                } else {
                  reject(new Error(`Release failed: ${releaseRes.statusCode} ${releaseData}`));
                }
              });
            });
            
            releaseReq.on('error', reject);
            releaseReq.write(releasePayload);
            releaseReq.end();
          } else {
            reject(new Error(`Ruleset creation failed: ${res.statusCode} ${data}`));
          }
        });
      });
      
      req.on('error', reject);
      req.write(createPayload);
      req.end();
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

deployRules();
