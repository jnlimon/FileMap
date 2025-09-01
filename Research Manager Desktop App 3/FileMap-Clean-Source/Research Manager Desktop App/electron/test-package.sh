#!/bin/bash

# Test FileMap App Packager
# This script creates a minimal test .app bundle

set -e

echo "🧪 Creating test FileMap.app..."

# Configuration
APP_NAME="FileMap-Test.app"
CONTENTS_DIR="$APP_NAME/Contents"
MACOS_DIR="$CONTENTS_DIR/MacOS"
RESOURCES_DIR="$CONTENTS_DIR/Resources"
FRAMEWORKS_DIR="$CONTENTS_DIR/Frameworks"

# Clean up any existing app
rm -rf "$APP_NAME"

# Create directory structure
mkdir -p "$MACOS_DIR" "$RESOURCES_DIR" "$FRAMEWORKS_DIR"

# Copy only the essential Electron binary
echo "📦 Copying Electron binary..."
cp "../node_modules/.electron-fmH6LRjN/dist/Electron.app/Contents/MacOS/Electron" "$MACOS_DIR/FileMap"

# Make it executable
chmod +x "$MACOS_DIR/FileMap"

# Copy all essential frameworks
echo "🔧 Copying essential frameworks..."
cp -r "../node_modules/.electron-fmH6LRjN/dist/Electron.app/Contents/Frameworks/Electron Framework.framework" "$FRAMEWORKS_DIR/"
cp -r "../node_modules/.electron-fmH6LRjN/dist/Electron.app/Contents/Frameworks/Mantle.framework" "$FRAMEWORKS_DIR/"
cp -r "../node_modules/.electron-fmH6LRjN/dist/Electron.app/Contents/Frameworks/ReactiveObjC.framework" "$FRAMEWORKS_DIR/"
cp -r "../node_modules/.electron-fmH6LRjN/dist/Electron.app/Contents/Frameworks/Squirrel.framework" "$FRAMEWORKS_DIR/"

# Copy helper apps
echo "🆘 Copying helper apps..."
cp -r "../node_modules/.electron-fmH6LRjN/dist/Electron.app/Contents/Frameworks/Electron Helper.app" "$FRAMEWORKS_DIR/"
cp -r "../node_modules/.electron-fmH6LRjN/dist/Electron.app/Contents/Frameworks/Electron Helper (GPU).app" "$FRAMEWORKS_DIR/"
cp -r "../node_modules/.electron-fmH6LRjN/dist/Electron.app/Contents/Frameworks/Electron Helper (Renderer).app" "$FRAMEWORKS_DIR/"
cp -r "../node_modules/.electron-fmH6LRjN/dist/Electron.app/Contents/Frameworks/Electron Helper (Plugin).app" "$FRAMEWORKS_DIR/"

# Copy our test main.js
echo "📁 Copying test main.js..."
cp test-main.js "$RESOURCES_DIR/main.js"

# Create minimal package.json for the app
cat > "$RESOURCES_DIR/package.json" << EOF
{
  "name": "filemap-test",
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
    <string>com.filemap.test</string>
    <key>CFBundleName</key>
    <string>FileMap Test</string>
    <key>CFBundleDisplayName</key>
    <string>FileMap Test</string>
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
echo "✅ FileMap-Test.app created successfully!"
echo "📊 App size:"
du -sh "$APP_NAME"

echo ""
echo "🧪 To test:"
echo "   open '$APP_NAME'"
echo ""
echo "📋 This is a minimal test version to debug the crash."
