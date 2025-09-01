#!/bin/bash

# Package FileMap into a .app bundle
echo "Packaging FileMap into .app bundle..."

# Create the app bundle structure
APP_NAME="FileMap.app"
CONTENTS_DIR="$APP_NAME/Contents"
MACOS_DIR="$CONTENTS_DIR/MacOS"
RESOURCES_DIR="$CONTENTS_DIR/Resources"
FRAMEWORKS_DIR="$CONTENTS_DIR/Frameworks"

# Clean up any existing bundle
rm -rf "$APP_NAME"

# Create directory structure
mkdir -p "$MACOS_DIR"
mkdir -p "$RESOURCES_DIR"
mkdir -p "$FRAMEWORKS_DIR"

# Copy the main Electron binary
cp -r "../node_modules/electron/dist/Electron.app/Contents/MacOS/Electron" "$MACOS_DIR/FileMap"

# Copy all required frameworks
echo "Copying Electron frameworks..."
cp -r "../node_modules/electron/dist/Electron.app/Contents/Frameworks/"* "$FRAMEWORKS_DIR/"

# Copy the main process files
cp main.js "$RESOURCES_DIR/"
cp fileUtils.js "$RESOURCES_DIR/"
cp preload.js "$RESOURCES_DIR/"

# Copy the built React app
cp -r research-manager "$RESOURCES_DIR/"

# Copy assets if they exist
if [ -d "../assets" ]; then
    cp -r ../assets "$RESOURCES_DIR/"
fi

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
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleSignature</key>
    <string>????</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.15.0</string>
    <key>NSHighResolutionCapable</key>
    <true/>
    <key>NSRequiresAquaSystemAppearance</key>
    <false/>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>
    <key>CFBundleLocalizations</key>
    <array>
        <string>en</string>
    </array>
</dict>
</plist>
EOF

# Make the executable executable
chmod +x "$MACOS_DIR/FileMap"

# Fix code signing by removing existing signatures and re-signing properly
echo "Fixing code signing..."
codesign --remove-signature "$APP_NAME" 2>/dev/null || true
codesign --force --deep --sign - --entitlements /dev/null "$APP_NAME"

echo "App bundle created: $APP_NAME"
echo "You can now drag $APP_NAME to your Applications folder!"
echo ""
echo "Bundle size:"
du -sh "$APP_NAME"
