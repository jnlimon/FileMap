#!/bin/bash

# FileMap Minimal App Packager
# This script creates the smallest possible .app bundle

set -e

echo "🚀 Creating minimal FileMap.app..."

# Configuration
APP_NAME="FileMap.app"
CONTENTS_DIR="$APP_NAME/Contents"
MACOS_DIR="$CONTENTS_DIR/MacOS"
RESOURCES_DIR="$CONTENTS_DIR/Resources"

# Clean up any existing app
rm -rf "$APP_NAME"

# Create directory structure
mkdir -p "$MACOS_DIR" "$RESOURCES_DIR"

# Copy only the essential Electron binary
echo "📦 Copying Electron binary..."
cp "../node_modules/.electron-fmH6LRjN/dist/Electron.app/Contents/MacOS/Electron" "$MACOS_DIR/FileMap"

# Make it executable
chmod +x "$MACOS_DIR/FileMap"

# Copy our application files
echo "📁 Copying application files..."
cp main.js "$RESOURCES_DIR/"
cp preload.js "$RESOURCES_DIR/"
cp fileUtils.js "$RESOURCES_DIR/"

# Copy only the built React app (not source code)
echo "⚛️ Copying React build..."
cp -r "../research-manager/build" "$RESOURCES_DIR/research-manager"

# Copy icon
cp -r "../assets" "$RESOURCES_DIR/"

# Create minimal package.json for the app
cat > "$RESOURCES_DIR/package.json" << EOF
{
  "name": "filemap",
  "version": "1.0.0",
  "main": "main.js",
  "private": true
}
EOF

# Create Info.plist
cat > "$CONTENTS_DIR/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>FileMap</string>
    <key>CFBundleIdentifier</key>
    <string>com.filemap.desktop</string>
    <key>CFBundleName</key>
    <string>FileMap</string>
    <key>CFBundleDisplayName</key>
    <string>FileMap</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>
    <key>CFBundleLocalizations</key>
    <array>
        <string>en</string>
    </array>
    <key>LSMinimumSystemVersion</key>
    <string>10.15.0</string>
    <key>NSHighResolutionCapable</key>
    <true/>
    <key>NSRequiresAquaSystemAppearance</key>
    <false/>
    <key>LSApplicationCategoryType</key>
    <string>public.app-category.productivity</string>
</dict>
</plist>
EOF

# Remove extended attributes that might cause issues
echo "🧹 Cleaning extended attributes..."
xattr -cr "$APP_NAME" 2>/dev/null || true

# Show final size
echo "✅ FileMap.app created successfully!"
echo "📊 App size:"
du -sh "$APP_NAME"

echo ""
echo "🎯 To install:"
echo "   cp -r '$APP_NAME' /Applications/"
echo ""
echo "🚀 To run:"
echo "   open '$APP_NAME'"
echo ""
echo "⚠️  Note: This minimal version may require Electron to be installed system-wide"
echo "   or may need additional setup. If it doesn't work, use package-app-optimized.sh instead."
