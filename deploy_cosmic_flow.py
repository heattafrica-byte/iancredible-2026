#!/usr/bin/env python3
"""
Deploy Cosmic Flow to Google Cloud Run
This is a wrapper that calls the Node.js deployment script to avoid Python dependency issues.
"""

import subprocess
import sys
import os

def deploy_cosmic_flow():
    """Deploy Cosmic Flow using Node.js"""
    
    print("🚀 Deploying Cosmic Flow to Cloud Run...")
    
    # Call the Node.js script instead
    script_path = os.path.join(os.path.dirname(__file__), '..', 'deploy-cosmic-flow.js')
    
    try:
        result = subprocess.run(['node', script_path] + sys.argv[1:], check=True)
        print("✅ Deployment complete!")
        return result.returncode
    except subprocess.CalledProcessError as e:
        print(f"❌ Deployment failed: {e}")
        return 1
    except FileNotFoundError:
        print("❌ Node.js not found. Please install Node.js: https://nodejs.org/")
        return 1

if __name__ == '__main__':
    sys.exit(deploy_cosmic_flow())
