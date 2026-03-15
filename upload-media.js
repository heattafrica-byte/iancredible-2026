#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const admin = require('firebase-admin')

const serviceAccountPath = path.join(__dirname, './service-account-key.json')

if (!fs.existsSync(serviceAccountPath)) {
  console.error(`❌ service-account-key.json not found at: ${serviceAccountPath}`)
  process.exit(1)
}

const serviceAccount = require(serviceAccountPath)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'iancredible-website.firebasestorage.app',
})

const bucket = admin.storage().bucket()

async function uploadDirectory(localDir, storagePath) {
  try {
    if (!fs.existsSync(localDir)) {
      console.error(`❌ Directory not found: ${localDir}`)
      process.exit(1)
    }

    const files = getAllFiles(localDir)

    if (files.length === 0) {
      console.log(`⚠️  No files found in ${localDir}`)
      process.exit(0)
    }

    console.log(`📁 Found ${files.length} file(s)`)
    console.log(`🚀 Uploading to: ${storagePath}\n`)

    let successCount = 0

    for (let i = 0; i < files.length; i++) {
      const fileFullPath = files[i]
      const fileName = path.basename(fileFullPath)
      const relativePath = path.relative(localDir, fileFullPath)
      const remotePath = path.join(storagePath, relativePath).replace(/\\/g, '/')

      try {
        await bucket.upload(fileFullPath, {
          destination: remotePath,
          metadata: {
            contentType: getContentType(fileName),
          },
        })

        successCount++
        console.log(`✅ [${i + 1}/${files.length}] ${path.basename(fileFullPath)}`)
      } catch (error) {
        // Check for bucket not found error
        if (error.message && error.message.includes('The specified bucket does not exist')) {
          console.error(`\n❌ FATAL: Cloud Storage bucket not found or not enabled!`)
          console.error(`📋 To fix this:`)
          console.error(`   1. Go to: https://console.firebase.google.com/project/iancredible-website/storage`)
          console.error(`   2. Click "Create" or "Start" to enable Cloud Storage`)
          console.error(`   3. After creation, try uploading again`)
          process.exit(1)
        }
        console.error(`❌ [${i + 1}/${files.length}] ${path.basename(fileFullPath)} - ${error.message}`)
      }
    }

    console.log(`\n✨ Upload complete!`)
    console.log(`📋 Summary: ${successCount}/${files.length} files uploaded`)
    process.exit(0)
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  }
}

function getAllFiles(dir) {
  const files = []
  function walkDir(currentDir) {
    const items = fs.readdirSync(currentDir)
    for (const item of items) {
      const fullPath = path.join(currentDir, item)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        walkDir(fullPath)
      } else {
        files.push(fullPath)
      }
    }
  }
  walkDir(dir)
  return files
}

function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase()
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.m4a': 'audio/mp4',
  }
  return types[ext] || 'application/octet-stream'
}

const args = process.argv.slice(2)
if (args.length !== 2) {
  console.log('Usage: node upload-media.js <local-dir> <storage-path>')
  process.exit(1)
}

const [localDir, storagePath] = args
uploadDirectory(localDir, storagePath)
