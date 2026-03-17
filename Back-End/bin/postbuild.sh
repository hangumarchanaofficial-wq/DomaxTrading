#!/bin/bash

rm -rf ./.amplify-hosting

# Compute directory (keep small - only server code + HTML/JS/CSS)
mkdir -p ./.amplify-hosting/compute/default/public

# Copy server files
cp ./server.js ./.amplify-hosting/compute/default/server.js
cp ./package.json ./.amplify-hosting/compute/default/package.json
cp -r ./node_modules ./.amplify-hosting/compute/default/node_modules

# Copy ONLY HTML, JS, CSS, JSON files to compute (no images/fonts)
cp ./public/*.html ./.amplify-hosting/compute/default/public/
cp ./public/*.js ./.amplify-hosting/compute/default/public/
cp ./public/*.css ./.amplify-hosting/compute/default/public/
cp ./public/*.json ./.amplify-hosting/compute/default/public/

# Static assets (ALL files including images - served by CDN)
mkdir -p ./.amplify-hosting/static
cp -r ./public/* ./.amplify-hosting/static/

# Deploy manifest
cp deploy-manifest.json ./.amplify-hosting/deploy-manifest.json

echo "Build complete!"
