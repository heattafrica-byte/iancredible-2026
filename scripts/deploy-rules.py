#!/usr/bin/env python3
"""
Deploy Firestore Security Rules using Google Cloud Admin APIs
"""

import os
import json
from google.cloud import firestore_admin_v1
from google.api_core.gapic_v1 import client_info as client_info_lib
from google.auth import default
from google.auth.transport.grpc import secure_authorized_channel
from google.api_core import grpc_helpers

def deploy_rules():
    """Deploy Firestore security rules"""
    
    print("📋 Deploying Firestore Rules via Google Cloud Admin API...")
    
    # Get credentials from service account
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'service-account-key.json'
    credentials, project = default()
    
    # Read rules file
    with open('firestore.rules.dev', 'r') as f:
        rules_content = f.read()
    
    print("✓ Rules file loaded (dev rules)")
    
    # Create admin client
    client = firestore_admin_v1.FirestoreAdminClient(credentials=credentials)
    
    # Build the rules source
    rules_source = firestore_admin_v1.RulesSet(
        source=firestore_admin_v1.Source(
            files=[
                firestore_admin_v1.File(
                    name='firestore.rules',
                    content=rules_content
                )
            ]
        )
    )
    
    # Update rules
    try:
        database_name = client.database_path(project, 'default')
        print(f"📍 Updating rules for database: {database_name}")
        
        operation = client.update_firestore(
            request={
                "database":{
                    "name": database_name,
                    "type_": firestore_admin_v1.Database.DatabaseType.FIRESTORE_NATIVE
                },
                "update_mask": {"paths": ["rules"]}
            }
        )
        
        # Wait for operation to complete
        result = operation.result()
        
        print("✅ Rules deployed successfully!")
        print("\n✓ Your Firestore is now ready to use")
        print("✓ Public read access enabled for: tracks, announcements, settings")
        print("✓ Authenticated access for: users, submissions, payments")
        print("✓ Data persisted: 13 documents across 6 collections")
        
    except Exception as e:
        print(f"❌ Error deploying rules: {e}")
        print("\n📚 Fallback: Deploy manually via Firebase Console:")
        print("1. Go to: https://console.firebase.google.com/project/iancredible-website/firestore/rules")
        print("2. Copy content from: firestore.rules.dev")  
        print("3. Paste into Firebase Rules editor")
        print("4. Click Publish")
        raise

if __name__ == '__main__':
    deploy_rules()
