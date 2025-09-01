#!/bin/bash

# Simple packaging script that copies Electron app and modifies it
echo "Creating FileMap app using simple method..."

# Clean up any existing bundle
rm -rf "FileMap.app"

# Copy the entire Electron app
cp -r "../node_modules/electron/dist/Electron.app" "FileMap.app"

# Rename the executable
mv "FileMap.app/Contents/MacOS/Electron" "FileMap.app/Contents/MacOS/FileMap"

# Remove the default app
rm -f "FileMap.app/Contents/Resources/default_app.asar"

# Copy our main process files
cp main.js "FileMap.app/Contents/Resources/"
cp fileUtils.js "FileMap.app/Contents/Resources/"
cp preload.js "FileMap.app/Contents/Resources/"

# Copy the built React app
cp -r research-manager "FileMap.app/Contents/Resources/"

# Copy assets if they exist
if [ -d "../assets" ]; then
    cp -r ../assets "FileMap.app/Contents/Resources/"
fi

# Update the Info.plist to change the app name and identifier
sed -i '' 's/Electron/FileMap/g' "FileMap.app/Contents/Info.plist"
sed -i '' 's/com.github.electron/com.filemap.desktop/g' "FileMap.app/Contents/Info.plist"

# Create a package.json that points to our main.js
cat > "FileMap.app/Contents/Resources/package.json" << EOF
{
  "name": "filemap",
  "version": "1.0.0",
  "main": "main.js",
  "private": true
}
EOF

# Fix permissions
chmod +x "FileMap.app/Contents/MacOS/FileMap"

# Remove extended attributes that might cause issues
xattr -cr "FileMap.app" 2>/dev/null || true

echo "FileMap.app created successfully!"
echo "Bundle size:"
du -sh "FileMap.app"
