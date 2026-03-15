#!/bin/bash

rm -rf ./.amplify-hosting

# Compute directory
mkdir -p ./.amplify-hosting/compute/default

cp ./server.js ./.amplify-hosting/compute/default/server.js
cp ./package.json ./.amplify-hosting/compute/default/package.json
cp -r ./node_modules ./.amplify-hosting/compute/default/node_modules

# Copy public folder inside compute (for Express to serve pages)
mkdir -p ./.amplify-hosting/compute/default/public
cp -r ./public/*.html ./.amplify-hosting/compute/default/public/
cp -r ./public/*.js ./.amplify-hosting/compute/default/public/
cp -r ./public/*.css ./.amplify-hosting/compute/default/public/
cp -r ./public/*.json ./.amplify-hosting/compute/default/public/

# Static assets (images, fonts, css, js - served by CDN, much faster)
mkdir -p ./.amplify-hosting/static
cp -r ./public/* ./.amplify-hosting/static/

# Deploy manifest
cp deploy-manifest.json ./.amplify-hosting/deploy-manifest.json

echo "Build complete!"
