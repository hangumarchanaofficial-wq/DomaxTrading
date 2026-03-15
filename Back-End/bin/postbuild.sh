#!/bin/bash

rm -rf ./.amplify-hosting

mkdir -p ./.amplify-hosting/compute/default

cp ./server.js ./.amplify-hosting/compute/default/server.js
cp ./package.json ./.amplify-hosting/compute/default/package.json
cp ./package-lock.json ./.amplify-hosting/compute/default/package-lock.json
cp -r ./node_modules ./.amplify-hosting/compute/default/node_modules

mkdir -p ./.amplify-hosting/static
cp -r ./public/* ./.amplify-hosting/static/

cp deploy-manifest.json ./.amplify-hosting/deploy-manifest.json

echo "Build complete!"
