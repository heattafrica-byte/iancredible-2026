#!/bin/bash

# COSMIC FLOW - Cloud Run Deployment Script
# This script automates deployment of cosmic-flow to Google Cloud Run

set -e  # Exit on error

echo "================================================"
echo "🚀 COSMIC FLOW - Cloud Run Deployment"
echo "================================================"
echo ""

# Configuration
PROJECT_ID="iancredible-website"
SERVICE_NAME="cosmic-flow-server"
REGION="us-central1"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# Check for required tools
echo "📋 Checking prerequisites..."

if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install it first:"
    echo "   brew install --cask google-cloud-sdk"
    echo "   Then run: gcloud init"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker not found. Cloud Build will be used instead (slower)."
    USE_CLOUD_BUILD=true
else
    echo "✅ Docker found"
    USE_CLOUD_BUILD=false
fi

echo "✅ gcloud found: $(gcloud --version | head -1)"
echo ""

# Step 1: Authenticate
echo "🔐 Step 1: Authenticate with Google Cloud"
echo "Available projects:"
gcloud projects list --format="value(project_id)"
echo ""
read -p "Confirm project ID [$PROJECT_ID]: " input_project
PROJECT_ID=${input_project:-$PROJECT_ID}

gcloud config set project $PROJECT_ID
echo "✅ Project set to: $PROJECT_ID"
echo ""

# Step 2: Build image
echo "🏗️  Step 2: Building Docker image..."
cd app/cosmic-flow

if [ "$USE_CLOUD_BUILD" = false ]; then
    # Local Docker build
    echo "Building locally..."
    docker build -t $IMAGE_NAME .
    echo "✅ Image built locally"
    echo ""
    
    # Step 3: Push to Google Container Registry
    echo "📤 Step 3: Pushing to Google Container Registry..."
    docker push $IMAGE_NAME
    echo "✅ Image pushed to GCR"
    echo ""
else
    # Use Cloud Build
    echo "Building via Cloud Build..."
    gcloud builds submit --config=cloudbuild.yaml
    echo "✅ Built via Cloud Build"
    echo ""
fi

# Step 4: Deploy to Cloud Run
echo "🚀 Step 4: Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars NODE_ENV=production
  
echo "✅ Deployment complete!"
echo ""

# Step 5: Get service URL
echo "📍 Getting service URL..."
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --format="value(status.url)")

echo ""
echo "================================================"
echo "✨ SUCCESS! Your service is live:"
echo "   $SERVICE_URL"
echo "================================================"
echo ""
echo "📝 Next steps:"
echo "1. Update NEXT_PUBLIC_COSMIC_FLOW_URL in .env.local:"
echo "   NEXT_PUBLIC_COSMIC_FLOW_URL=$SERVICE_URL"
echo ""
echo "2. Redeploy the Next.js app to apply changes"
echo ""
echo "3. WebSocket endpoint: $SERVICE_URL"
echo ""
