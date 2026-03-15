#!/bin/bash

rm -rf ./.amplify-hosting

# Compute (ONLY server code - keep it small!)
mkdir -p ./.amplify-hosting/compute/default

cp ./server.js ./.amplify-hosting/compute/default/server.js
cp ./package.json ./.amplify-hosting/compute/default/package.json
cp -r ./node_modules ./.amplify-hosting/compute/default/node_modules

# Static files (HTML, CSS, JS, images - served by CDN)
mkdir -p ./.amplify-hosting/static
cp -r ./public/* ./.amplify-hosting/static/

# Deploy manifest
cp deploy-manifest.json ./.amplify-hosting/deploy-manifest.json

echo "Build complete!"
