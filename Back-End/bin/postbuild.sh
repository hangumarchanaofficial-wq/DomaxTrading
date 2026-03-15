#!/bin/bash

rm -rf ./.amplify-hosting

mkdir -p ./.amplify-hosting/compute/default

# Copy server files
cp ./server.js ./.amplify-hosting/compute/default/server.js
cp ./package.json ./.amplify-hosting/compute/default/package.json
cp ./package-lock.json ./.amplify-hosting/compute/default/package-lock.json
cp -r ./node_modules ./.amplify-hosting/compute/default/node_modules

# Copy public folder INSIDE compute so Express can find it
cp -r ./public ./.amplify-hosting/compute/default/public

# Also copy to static for CDN caching
mkdir -p ./.amplify-hosting/static
cp -r ./public/* ./.amplify-hosting/static/

# Copy deploy manifest
cp deploy-manifest.json ./.amplify-hosting/deploy-manifest.json

echo "Build complete!"
