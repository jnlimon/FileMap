# macOS Security Warning Fix Guide

## The Problem
When you first try to open FileMap, macOS may show this error:
> "macOS cannot verify that this app is free from malware"

This happens because FileMap is not code-signed by Apple, which is normal for open-source applications.

## Automatic Fix (Recommended)
The FileMap launcher now automatically handles this issue:

1. **Run the launcher**: Double-click `FileMap-Launcher.command`
2. **The script will automatically**:
   - Remove quarantine attributes
   - Add FileMap to approved applications
   - Bypass the security warning
3. **FileMap will launch normally**

## Manual Fix (If Automatic Fails)

### Method 1: Right-Click Open
1. **Right-click** on `FileMap.app` (in the `dist/mac/` folder)
2. **Select "Open"** from the context menu
3. **Click "Open"** in the security dialog
4. FileMap will be added to your approved applications

### Method 2: Terminal Commands
Open Terminal and run these commands:

```bash
# Navigate to FileMap directory
cd /path/to/FileMap-main/electron

# Remove quarantine attribute
xattr -d com.apple.quarantine dist/mac/FileMap.app

# Add to approved applications
spctl --add dist/mac/FileMap.app

# Launch the app
open dist/mac/FileMap.app
```

### Method 3: System Preferences
1. **Open System Preferences** → **Security & Privacy**
2. **Click the "General" tab**
3. **Look for a message** about FileMap being blocked
4. **Click "Open Anyway"**
5. **Confirm** by clicking "Open"

## For Developers: Code Signing

To avoid this issue entirely, you can code-sign the application:

### Prerequisites
- Apple Developer Account ($99/year)
- Xcode Command Line Tools installed

### Setup
1. **Get your Team ID**:
   ```bash
   security find-identity -v -p codesigning
   ```

2. **Update electron-builder.json**:
   Replace `YOUR_TEAM_ID` with your actual Team ID

3. **Set environment variables**:
   ```bash
   export APPLE_ID="your-apple-id@example.com"
   export APPLE_ID_PASSWORD="your-app-specific-password"
   export APPLE_TEAM_ID="YOUR_TEAM_ID"
   ```

4. **Build with code signing**:
   ```bash
   npm run dist
   ```

### Notarization (Optional)
For distribution outside the App Store:

1. **Install notarization tool**:
   ```bash
   npm install @electron/notarize
   ```

2. **The notarize.js script** is already included
3. **Build with notarization**:
   ```bash
   npm run dist
   ```

## Troubleshooting

### "FileMap.app is damaged and can't be opened"
This usually means the quarantine attribute wasn't properly removed:

```bash
xattr -d com.apple.quarantine FileMap.app
```

### "The app can't be opened because it is from an unidentified developer"
This means Gatekeeper is still blocking the app:

```bash
spctl --add FileMap.app
```

### "Operation not permitted"
You may need to run with sudo:

```bash
sudo spctl --add FileMap.app
```

## Security Note
FileMap is open-source and safe to use. The security warning appears because:
- The app isn't code-signed by Apple
- macOS doesn't recognize the developer
- This is normal for open-source applications

The launcher script automatically handles these security concerns for you.
