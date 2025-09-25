#!/bin/bash

# FileMap Security Fix Script
echo "🔒 FileMap Security Fix"
echo "======================"
echo "This script will fix the macOS security warning for FileMap."
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "📁 Script directory: $SCRIPT_DIR"

# Check if FileMap.app exists
if [ -d "$SCRIPT_DIR/electron/dist/mac/FileMap.app" ]; then
    APP_PATH="$SCRIPT_DIR/electron/dist/mac/FileMap.app"
    echo "✅ Found FileMap.app"
elif [ -d "$SCRIPT_DIR/dist/mac/FileMap.app" ]; then
    APP_PATH="$SCRIPT_DIR/dist/mac/FileMap.app"
    echo "✅ Found FileMap.app"
else
    echo "❌ FileMap.app not found!"
    echo "Please build the app first by running:"
    echo "  cd electron && npm run build"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

echo "🔧 Fixing security issues..."

# Remove quarantine attribute
echo "📱 Removing quarantine attribute..."
if xattr -l "$APP_PATH" 2>/dev/null | grep -q "com.apple.quarantine"; then
    xattr -d com.apple.quarantine "$APP_PATH" 2>/dev/null
    echo "✅ Quarantine attribute removed"
else
    echo "✅ No quarantine attribute found"
fi

# Add to approved applications
echo "🔐 Adding to approved applications..."
if spctl --add "$APP_PATH" 2>/dev/null; then
    echo "✅ FileMap added to approved applications"
else
    echo "⚠️  Could not automatically add to approved applications"
    echo "You may need to run this script with administrator privileges:"
    echo "  sudo ./Fix-Security.command"
    echo ""
    echo "Or manually approve the app:"
    echo "1. Right-click on FileMap.app"
    echo "2. Select 'Open' from the context menu"
    echo "3. Click 'Open' in the security dialog"
fi

# Verify the fix
echo "🔍 Verifying fix..."
if spctl --assess --verbose "$APP_PATH" 2>/dev/null; then
    echo "✅ FileMap is now approved by Gatekeeper"
    echo ""
    echo "🎉 Security fix completed successfully!"
    echo "You can now run FileMap without security warnings."
else
    echo "⚠️  FileMap may still show security warnings"
    echo "Try the manual approval method above."
fi

echo ""
echo "🚀 To launch FileMap, run: ./FileMap-Launcher.command"
echo ""
read -p "Press Enter to exit..."
