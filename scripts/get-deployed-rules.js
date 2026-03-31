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
    path: `/v1/projects/${projectId}/releases?pageSize=1`,
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
        if (result.releases && result.releases.length > 0) {
          const release = result.releases[0];
          console.log('📋 Current Deployed Rules:');
          console.log('Release:', release.name);
          console.log('Ruleset:', release.rulesetName);
          
          // Now get the actual ruleset content
          const rulesetPath = `/v1/${release.rulesetName}`;
          const rulesetOptions = {
            hostname: 'firebaserules.googleapis.com',
            port: 443,
            path: rulesetPath,
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          };
          
          const rulesetReq = https.request(rulesetOptions, (rulesetRes) => {
            let rulesetData = '';
            rulesetRes.on('data', chunk => rulesetData += chunk);
            rulesetRes.on('end', () => {
              if (rulesetRes.statusCode === 200) {
                const rulesetResult = JSON.parse(rulesetData);
                console.log('\n📝 Deployed Rules Content:\n');
                rulesetResult.source.files.forEach(file => {
                  console.log(file.content);
                });
              } else {
                console.log('Could not retrieve ruleset content');
              }
              process.exit(0);
            });
          });
          
          rulesetReq.on('error', (e) => {
            console.error('Error:', e.message);
            process.exit(1);
          });
          rulesetReq.end();
        } else {
          console.log('No rules deployed');
          process.exit(0);
        }
      } else {
        console.log('Status:', res.statusCode);
        console.log('Response:', data);
        process.exit(1);
      }
    });
  });
  
  req.on('error', (e) => {
    console.error('Error:', e.message);
    process.exit(1);
  });
  
  req.end();
});
