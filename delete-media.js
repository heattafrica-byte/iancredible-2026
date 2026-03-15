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

async function deleteAllFiles(folderPath) {
  try {
    console.log(`🗑️  Deleting all files from: ${folderPath}\n`)

    const [files] = await bucket.getFiles({ prefix: folderPath })

    if (files.length === 0) {
      console.log(`⚠️  No files found in ${folderPath}`)
      process.exit(0)
    }

    console.log(`📁 Found ${files.length} file(s) to delete`)
    console.log(`🔄 Deleting files...\n`)

    let successCount = 0

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        await file.delete()
        successCount++
        console.log(`✅ [${i + 1}/${files.length}] ${file.name}`)
      } catch (error) {
        console.error(`❌ [${i + 1}/${files.length}] ${file.name} - ${error.message}`)
      }
    }

    console.log(`\n✨ Deletion complete!`)
    console.log(`📋 Summary: ${successCount}/${files.length} files deleted`)
    process.exit(0)
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  }
}

const args = process.argv.slice(2)
if (args.length !== 1) {
  console.log('Usage: node delete-media.js <folder-path>')
  console.log('Examples:')
  console.log('  node delete-media.js images/')
  console.log('  node delete-media.js videos/')
  console.log('  node delete-media.js audio/')
  process.exit(1)
}

const folderPath = args[0]
deleteAllFiles(folderPath)
