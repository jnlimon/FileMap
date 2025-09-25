# FileMap Installation Guide

## Quick Start (Recommended)

1. **Download FileMap** and extract it to your desired location
2. **Double-click `FileMap-Launcher.command`** to run the application
3. **The launcher will automatically:**
   - Install Homebrew (if not present)
   - Install Node.js 18+ if not present
   - Install all required dependencies
   - Build the React application
   - Launch FileMap

## Automatic Installation Process

The FileMap launcher now automatically handles the complete setup for first-time users:

### Method 1: Homebrew + Node.js (Preferred)
- **If Homebrew is not installed**: The launcher will automatically install Homebrew first
- **If Homebrew is installed**: The launcher will install Node.js 18 via `brew install node@18`
- This is the fastest and most reliable method

### Method 2: Direct Node.js Download
- If Homebrew installation fails, the launcher will:
  - Detect your Mac's architecture (Intel x64 or Apple Silicon ARM64)
  - Download the appropriate Node.js 18 LTS version
  - Install it to `/usr/local/`
  - Set up the PATH automatically

### Method 3: Manual Installation
- If both methods fail, the launcher will:
  - Open the Node.js download page in your browser
  - Provide instructions for manual installation

## System Requirements

- **macOS 10.15+** (Catalina or later)
- **Internet connection** (for initial setup)
- **Administrator privileges** (for Node.js installation)

## macOS Security Warning

On first launch, macOS may show a security warning: *"macOS cannot verify that this app is free from malware"*

**✅ This is automatically handled by the launcher script!**

The launcher will:
- Remove quarantine attributes
- Add FileMap to approved applications
- Bypass the security warning automatically

For manual fixes or more details, see [MACOS_SECURITY_GUIDE.md](MACOS_SECURITY_GUIDE.md).

## Troubleshooting

### If the launcher fails:
1. **Check your internet connection**
2. **Ensure you have administrator privileges** (for Node.js installation)
3. **Try running the launcher again** - it will skip already installed components

### If Node.js installation fails:
1. **Install Homebrew first**: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
2. **Then run the FileMap launcher again**

### Manual Node.js installation:
1. Visit [nodejs.org](https://nodejs.org/)
2. Download Node.js 18+ LTS for macOS
3. Run the installer
4. Restart your terminal and run FileMap-Launcher.command

## Data Storage

Your FileMap data is automatically saved to:
```
~/Library/Application Support/filemap-desktop/research-manager-data.json
```

## Support

If you encounter any issues:
1. Check the console output for error messages
2. Ensure all system requirements are met
3. Try running the launcher with administrator privileges
