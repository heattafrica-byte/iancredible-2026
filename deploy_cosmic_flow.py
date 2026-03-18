#!/usr/bin/env python3
"""
Deploy Cosmic Flow to Google Cloud Run
"""

import os
import json
import subprocess
import sys
from pathlib import Path
from google.auth import crypt
from google.oauth2 import service_account
from google.cloud import run_v2, cloudbuild_v1
from google.api_core.gapic_v1 import client_info as grpc_client_info

# Configuration
PROJECT_ID = "iancredible-website"
REGION = "us-central1"
SERVICE_NAME = "cosmic-flow-server"
SERVICE_ACCOUNT_KEY = "./service-account-key.json"

def load_service_account():
    """Load service account credentials"""
    with open(SERVICE_ACCOUNT_KEY) as f:
        key_data = json.load(f)
    return service_account.Credentials.from_service_account_info(key_data)

def get_service_url():
    """Get the URL of an existing Cloud Run service"""
    try:
        credentials = load_service_account()
        client = run_v2.ServicesClient(credentials=credentials)
        
        parent = f"projects/{PROJECT_ID}/locations/{REGION}"
        request = run_v2.ListServicesRequest(parent=parent)
        
        for service in client.list_services(request=request):
            if SERVICE_NAME in service.name:
                # Extract the URL from the service
                for traffic_target in service.traffic:
                    if traffic_target.percent == 100:
                        # The URL is in the service status
                        if hasattr(service, 'uri'):
                            return service.uri
        return None
    except Exception as e:
        print(f"Error getting service URL: {e}")
        return None

def deploy_with_gcloud():
    """Deploy using gcloud command (fallback)"""
    print("Deploying to Cloud Run using gcloud...")
    
    os.chdir("app/cosmic-flow")
    
    try:
        cmd = [
            "gcloud", "run", "deploy", SERVICE_NAME,
            "--source", ".",
            "--platform", "managed",
            "--region", REGION,
            "--project", PROJECT_ID,
            "--allow-unauthenticated",
            "--set-env-vars", "NODE_ENV=production",
            "--port", "3000",
            "--quiet"
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            print("Error deploying:", result.stderr)
            return None
        
        # Extract URL from output
        for line in result.stdout.split('\n'):
            if 'https://' in line and 'run.app' in line:
                url = line.strip()
                if url.startswith('https://'):
                    return url
        
        # If URL not found in output, query the service
        return get_service_url()
        
    except Exception as e:
        print(f"Error: {e}")
        return None
    finally:
        os.chdir("../..")

def update_env_and_redeploy(cosmic_flow_url):
    """Update .env files and redeploy the portfolio"""
    print(f"\n✓ Cloud Run service deployed: {cosmic_flow_url}")
    print(f"\nUpdating portfolio environment variables...")
    
    # Check if .env.production exists, if not create it
    env_file = ".env.production"
    
    if os.path.exists(env_file):
        with open(env_file, 'r') as f:
            content = f.read()
        
        # Update or add the COSMIC_FLOW_URL
        if 'NEXT_PUBLIC_COSMIC_FLOW_URL=' in content:
            content = content.replace(
                [line for line in content.split('\n') if 'NEXT_PUBLIC_COSMIC_FLOW_URL=' in line][0],
                f'NEXT_PUBLIC_COSMIC_FLOW_URL={cosmic_flow_url}'
            )
        else:
            content += f'\nNEXT_PUBLIC_COSMIC_FLOW_URL={cosmic_flow_url}\n'
    else:
        content = f'NEXT_PUBLIC_COSMIC_FLOW_URL={cosmic_flow_url}\n'
    
    with open(env_file, 'w') as f:
        f.write(content)
    
    print(f"✓ Updated {env_file}")
    print("\nRebuilding portfolio...")
    
    # Rebuild and redeploy
    try:
        result = subprocess.run(
            ["npm", "run", "build"],
            capture_output=True,
            text=True,
            cwd="."
        )
        
        if result.returncode != 0:
            print("Build failed:", result.stderr)
            return False
        
        print("✓ Build successful")
        print("\nDeploying to Firebase Hosting...")
        
        result = subprocess.run(
            [
                "firebase", "deploy", "--only", "hosting",
                "--non-interactive"
            ],
            capture_output=True,
            text=True,
            env={**os.environ, "GOOGLE_APPLICATION_CREDENTIALS": SERVICE_ACCOUNT_KEY}
        )
        
        if result.returncode != 0:
            print("Firebase deployment failed:", result.stderr)
            return False
        
        print("✓ Portfolio redeployed!")
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    print("=" * 60)
    print("Cosmic Flow Cloud Run Deployment")
    print("=" * 60)
    
    # Check if gcloud is available
    result = subprocess.run(["which", "gcloud"], capture_output=True)
    has_gcloud = result.returncode == 0
    
    if not has_gcloud:
        print("\n⚠ gcloud CLI not found in PATH")
        print("Attempting to install Google Cloud SDK...")
        
        # Try to skip installation prompt
        print("\nNote: Manual gcloud installation may be required.")
        print("For now, using alternative deployment method...\n")
        
        # Try alternative approach
        print("Installing gcloud CLI...")
        result = subprocess.run(
            ["npm", "install", "-g", "@google-cloud/sdk"],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print("✓ gcloud CLI installed")
        else:
            print("✗ Could not install gcloud CLI automatically")
            print("\nPlease install manually:")
            print("  brew install google-cloud-sdk")
            print("\nThen run:")
            print("  cd app/cosmic-flow")
            print("  gcloud run deploy cosmic-flow-server --source . --platform managed --region us-central1 --project iancredible-website --allow-unauthenticated")
            sys.exit(1)
    
    # Deploy using gcloud
    cosmic_flow_url = deploy_with_gcloud()
    
    if not cosmic_flow_url:
        print("\n✗ Failed to deploy to Cloud Run")
        sys.exit(1)
    
    # Update env and redeploy portfolio
    if update_env_and_redeploy(cosmic_flow_url):
        print("\n" + "=" * 60)
        print("✓ DEPLOYMENT COMPLETE!")
        print("=" * 60)
        print(f"\nCosmic Flow Backend: {cosmic_flow_url}")
        print(f"Portfolio: https://iancredible-website.web.app")
        print("\nYour Cosmic Flow iframe should now connect to the live server!")
    else:
        print("\n✗ Portfolio redeployment failed")
        print(f"Manual steps: Update .env.production with NEXT_PUBLIC_COSMIC_FLOW_URL={cosmic_flow_url}")
        sys.exit(1)

if __name__ == "__main__":
    main()
