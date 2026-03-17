#!/bin/bash

rm -rf ./.amplify-hosting

# ── Compute directory (server + public files for SSR) ──
mkdir -p ./.amplify-hosting/compute/default

# Copy server files
cp ./server.js ./.amplify-hosting/compute/default/server.js
cp ./package.json ./.amplify-hosting/compute/default/package.json
cp -r ./node_modules ./.amplify-hosting/compute/default/node_modules

# Copy the ENTIRE public folder (including subdirectories: css/, js/, assests/)
cp -r ./public ./.amplify-hosting/compute/default/public

# ── Static assets (ALL files served by CDN) ──
mkdir -p ./.amplify-hosting/static
cp -r ./public/* ./.amplify-hosting/static/

# Deploy manifest
cp deploy-manifest.json ./.amplify-hosting/deploy-manifest.json

echo "Build complete!"
