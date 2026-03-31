#!/bin/bash
# Cloud Run Deployment Script for IANCREDIBLE Wappsite

PROJECT_ID="iancredible-website"
SERVICE_NAME="iancredible-wappsite"
REGION="us-central1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Firebase Configuration
export NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyCqoKll_rAcRWJrO0SJ5pH7LK3-Ay_Juc8"
export NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="iancredible-website.firebaseapp.com"
export NEXT_PUBLIC_FIREBASE_PROJECT_ID="iancredible-website"
export NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="iancredible-website.firebasestorage.app"
export NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="796662323239"
export NEXT_PUBLIC_FIREBASE_APP_ID="1:796662323239:web:4e7c185a08c0918f941602"

echo "📦 Building Docker image..."
docker build \
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY="$NEXT_PUBLIC_FIREBASE_API_KEY" \
  --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" \
  --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID="$NEXT_PUBLIC_FIREBASE_PROJECT_ID" \
  --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" \
  --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" \
  --build-arg NEXT_PUBLIC_FIREBASE_APP_ID="$NEXT_PUBLIC_FIREBASE_APP_ID" \
  -t "$IMAGE_NAME:latest" \
  -t "$IMAGE_NAME:$(date +%s)" \
  .

echo "🚀 Pushing to Container Registry..."
docker push "$IMAGE_NAME:latest"

echo "📮 Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE_NAME:latest" \
  --platform managed \
  --region "$REGION" \
  --project "$PROJECT_ID" \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 3600 \
  --set-env-vars NEXT_PUBLIC_FIREBASE_API_KEY="$NEXT_PUBLIC_FIREBASE_API_KEY" \
  --set-env-vars NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" \
  --set-env-vars NEXT_PUBLIC_FIREBASE_PROJECT_ID="$NEXT_PUBLIC_FIREBASE_PROJECT_ID" \
  --set-env-vars NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" \
  --set-env-vars NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" \
  --set-env-vars NEXT_PUBLIC_FIREBASE_APP_ID="$NEXT_PUBLIC_FIREBASE_APP_ID" \
  --set-env-vars NODE_ENV=production

echo "✅ Deployment complete!"
echo "🌐 Your service is available at: https://$(gcloud run services describe $SERVICE_NAME --region=$REGION --project=$PROJECT_ID --format='value(status.url)')"
