const https = require('https');
const fs = require('fs');

const serviceAccount = require('../service-account-key.json');

const jwtClient = new (require('google-auth-library').JWT)({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ['https://www.googleapis.com/auth/cloud-platform']
});

jwtClient.authorize((err, tokens) => {
  if (err) {
    console.error('Auth failed:', err);
    process.exit(1);
  }
  
  const token = tokens.access_token;
  const projectId = 'iancredible-website';
  
  const options = {
    hostname: 'firebaserules.googleapis.com',
    port: 443,
    path: `/v1/projects/${projectId}/releases`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  
  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (res.statusCode === 200) {
        const result = JSON.parse(data);
        console.log('📋 Current Firestore Rules Status:');
        if (result.releases && result.releases.length > 0) {
          result.releases.forEach(r => {
            if (r.name.includes('cloud.firestore')) {
              console.log('✓ Cloud Firestore Release:', r.name);
              console.log('  Ruleset:', r.rulesetName);
              console.log('\n✅ Rules are deployed!');
            }
          });
        } else {
          console.log('⚠️  No Cloud Firestore rules deployed yet');
        }
      } else {
        console.log('Status:', res.statusCode);
        console.log('Response:', data);
      }
      process.exit(0);
    });
  });
  
  req.on('error', (e) => {
    console.error('Error:', e.message);
    process.exit(1);
  });
  
  req.end();
});
