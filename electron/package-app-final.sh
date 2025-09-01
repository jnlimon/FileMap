#!/bin/bash

# FileMap Final App Packager
# This script creates a complete, working .app bundle with all fixes

set -e

echo "🚀 Creating final FileMap.app with all fixes..."
echo "================================================"

# Configuration
APP_NAME="FileMap-Final.app"
CONTENTS_DIR="$APP_NAME/Contents"
MACOS_DIR="$CONTENTS_DIR/MacOS"
RESOURCES_DIR="$CONTENTS_DIR/Resources"
FRAMEWORKS_DIR="$CONTENTS_DIR/Frameworks"

# Clean up any existing app
rm -rf "$APP_NAME"

# Create directory structure
mkdir -p "$MACOS_DIR" "$RESOURCES_DIR" "$FRAMEWORKS_DIR"

# Check if we have the necessary Electron files
if [ ! -d "../node_modules/.electron-fmH6LRjN/dist/Electron.app" ]; then
    echo "❌ Electron not found. Installing dependencies first..."
    cd ..
    npm install
    cd electron
fi

# Copy only the essential Electron binary
echo "📦 Copying Electron binary..."
cp "../node_modules/.electron-fmH6LRjN/dist/Electron.app/Contents/MacOS/Electron" "$MACOS_DIR/FileMap"

# Make it executable
chmod +x "$MACOS_DIR/FileMap"

# Copy all essential frameworks (these are required for Electron to work)
echo "🔧 Copying essential frameworks..."
cp -r "../node_modules/.electron-fmH6LRjN/dist/Electron.app/Contents/Frameworks/Electron Framework.framework" "$FRAMEWORKS_DIR/"
cp -r "../node_modules/.electron-fmH6LRjN/dist/Electron.app/Contents/Frameworks/Mantle.framework" "$FRAMEWORKS_DIR/"
cp -r "../node_modules/.electron-fmH6LRjN/dist/Electron.app/Contents/Frameworks/ReactiveObjC.framework" "$FRAMEWORKS_DIR/"
cp -r "../node_modules/.electron-fmH6LRjN/dist/Electron.app/Contents/Frameworks/Squirrel.framework" "$FRAMEWORKS_DIR/"

# Copy helper apps (required for Electron to function)
echo "🆘 Copying helper apps..."
cp -r "../node_modules/.electron-fmH6LRjN/dist/Electron.app/Contents/Frameworks/Electron Helper.app" "$FRAMEWORKS_DIR/"
cp -r "../node_modules/.electron-fmH6LRjN/dist/Electron.app/Contents/Frameworks/Electron Helper (GPU).app" "$FRAMEWORKS_DIR/"
cp -r "../node_modules/.electron-fmH6LRjN/dist/Electron.app/Contents/Frameworks/Electron Helper (Renderer).app" "$FRAMEWORKS_DIR/"
cp -r "../node_modules/.electron-fmH6LRjN/dist/Electron.app/Contents/Frameworks/Electron Helper (Plugin).app" "$FRAMEWORKS_DIR/"

# Copy our application files
echo "📁 Copying application files..."
cp main.js "$RESOURCES_DIR/"
cp preload.js "$RESOURCES_DIR/"
cp fileUtils.js "$RESOURCES_DIR/"

# Ensure React build is available and up-to-date
echo "⚛️ Preparing React build..."
if [ ! -d "../research-manager/build" ]; then
    echo "❌ React build not found. Building now..."
    cd ../research-manager
    npm install
    npm run build
    cd ../electron
fi

# Copy only the built React app (not source code)
echo "📦 Copying React build..."
cp -r "../research-manager/build" "$RESOURCES_DIR/research-manager"

# Copy assets
if [ -d "../assets" ]; then
    echo "🎨 Copying assets..."
    cp -r "../assets" "$RESOURCES_DIR/"
else
    echo "⚠️  Assets directory not found, creating placeholder..."
    mkdir -p "$RESOURCES_DIR/assets"
fi

# Create package.json for the app
cat > "$RESOURCES_DIR/package.json" << EOF
{
  "name": "filemap",
  "version": "1.0.0",
  "main": "main.js",
  "private": true,
  "description": "FileMap - Desktop Research File Management",
  "author": "Research Manager Team",
  "license": "MIT"
}
EOF

# Create comprehensive Info.plist
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
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <false/>
    </dict>
    <key>LSUIElement</key>
    <false/>
    <key>NSPrincipalClass</key>
    <string>NSApplication</string>
</dict>
</plist>
EOF

# Create PkgInfo
echo "APPL????" > "$CONTENTS_DIR/PkgInfo"

# Remove extended attributes that might cause issues
echo "🧹 Cleaning extended attributes..."
xattr -cr "$APP_NAME" 2>/dev/null || true

# Set proper permissions
echo "🔐 Setting proper permissions..."
chmod -R 755 "$APP_NAME"
chmod +x "$MACOS_DIR/FileMap"

# Create a simple launcher script inside the app
cat > "$RESOURCES_DIR/launch.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
exec ./FileMap
EOF

chmod +x "$RESOURCES_DIR/launch.sh"

# Show final size and details
echo ""
echo "✅ FileMap.app created successfully!"
echo "================================================"
echo "📊 App size:"
du -sh "$APP_NAME"
echo ""
echo "📁 App contents:"
ls -la "$APP_NAME/Contents/Resources/"
echo ""
echo "🎯 To install:"
echo "   cp -r '$APP_NAME' /Applications/"
echo ""
echo "🚀 To run:"
echo "   open '$APP_NAME'"
echo ""
echo "💾 Data will be saved to:"
echo "   ~/Library/Application Support/FileMap/"
echo ""
echo "🔧 Features included:"
echo "   ✅ Auto-save every 30 seconds"
echo "   ✅ Data persistence between sessions"
echo "   ✅ Proper cleanup on app close"
echo "   ✅ All necessary frameworks"
echo "   ✅ React build included"
echo ""
echo "📋 This version includes all fixes for data persistence and resource management."


