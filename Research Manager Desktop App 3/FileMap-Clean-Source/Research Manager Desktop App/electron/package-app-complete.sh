#!/bin/bash

# FileMap Complete App Packager
# This script copies the entire Electron.app and just replaces main.js

set -e

echo "🚀 Creating complete FileMap.app..."

# Configuration
APP_NAME="FileMap-Complete.app"
SOURCE_ELECTRON="../node_modules/.electron-fmH6LRjN/dist/Electron.app"

# Clean up any existing app
rm -rf "$APP_NAME"

# Copy the entire Electron.app structure
echo "📦 Copying complete Electron.app..."
cp -r "$SOURCE_ELECTRON" "$APP_NAME"

# Rename the executable
echo "🔄 Renaming executable..."
mv "$APP_NAME/Contents/MacOS/Electron" "$APP_NAME/Contents/MacOS/FileMap"

# Copy our main.js
echo "📁 Copying our main.js..."
cp main.js "$APP_NAME/Contents/Resources/"

# Copy our other files
echo "📁 Copying other application files..."
cp preload.js "$APP_NAME/Contents/Resources/"
cp fileUtils.js "$APP_NAME/Contents/Resources/"

# Remove default app and copy React build
echo "🗑️ Removing default app..."
rm -f "$APP_NAME/Contents/Resources/default_app.asar"

echo "⚛️ Copying React build..."
rm -rf "$APP_NAME/Contents/Resources/research-manager"
cp -r "../research-manager/build" "$APP_NAME/Contents/Resources/research-manager"

# Copy icon
echo "🎨 Copying icon..."
rm -rf "$APP_NAME/Contents/Resources/assets"
cp -r "../assets" "$APP_NAME/Contents/Resources/"

# Update package.json
echo "📦 Updating package.json..."
cat > "$APP_NAME/Contents/Resources/package.json" << EOF
{
  "name": "filemap",
  "version": "1.0.0",
  "main": "main.js",
  "private": true
}
EOF

# Update Info.plist to change the app name
echo "📝 Updating Info.plist..."
sed -i '' 's/Electron/FileMap/g' "$APP_NAME/Contents/Info.plist"
sed -i '' 's/com.github.electron/com.filemap.desktop/g' "$APP_NAME/Contents/Info.plist"

# Remove extended attributes that might cause issues
echo "🧹 Cleaning extended attributes..."
xattr -cr "$APP_NAME" 2>/dev/null || true

# Show final size
echo "✅ FileMap-Complete.app created successfully!"
echo "📊 App size:"
du -sh "$APP_NAME"

echo ""
echo "🎯 To install:"
echo "   cp -r '$APP_NAME' /Applications/"
echo ""
echo "🚀 To run:"
echo "   open '$APP_NAME'"
echo ""
echo "📋 This version includes the complete Electron.app structure for maximum compatibility."
