#!/bin/bash

# Build and Link Search Library Script
# This script builds the search library and links it to the sandbox

set -e  # Exit on error

echo "Building search library (assets included automatically)..."
cd packages/search
npx ng build search-lib

echo "Creating global npm link..."
cd projects/search-lib/dist
npm link

echo "Linking to sandbox..."
cd ../../../../sandbox/search-client-example
npm link @sourceloop/search-client

echo "✅ Done! Search library built and linked successfully."
echo ""
echo "To start the sandbox, run:"
echo "  cd sandbox/search-client-example"
echo "  npm start"
