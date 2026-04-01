#!/usr/bin/env python3
"""
Deploy Firestore Security Rules
This is a wrapper that calls the Node.js deployment script to avoid Python dependency issues.
"""

import subprocess
import sys
import os

def deploy_rules():
    """Deploy Firestore security rules using Node.js"""
    
    print("📋 Deploying Firestore Rules...")
    
    # Call the Node.js script instead
    script_path = os.path.join(os.path.dirname(__file__), 'deploy-rules.js')
    
    try:
        result = subprocess.run(['node', script_path] + sys.argv[1:], check=True)
        print("✅ Rules deployed successfully!")
        return result.returncode
    except subprocess.CalledProcessError as e:
        print(f"❌ Deployment failed: {e}")
        return 1
    except FileNotFoundError:
        print("❌ Node.js not found. Please install Node.js: https://nodejs.org/")
        return 1

if __name__ == '__main__':
    sys.exit(deploy_rules())
