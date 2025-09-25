#!/bin/bash

# FileMap Launcher for macOS
echo "🚀 Starting FileMap..."
echo "=================================="
echo "📋 This launcher will automatically set up everything needed for FileMap"
echo "   including Homebrew (if needed), Node.js, dependencies, and the React application."
echo "=================================="

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "📁 Script directory: $SCRIPT_DIR"

# Navigate to the electron directory
cd "$SCRIPT_DIR/electron"
echo "📂 Working in electron directory: $(pwd)"

# Set Node.js path (you might need to adjust this based on your Node.js installation)
export PATH="/opt/homebrew/opt/node@18/bin:/usr/local/bin:$PATH"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found."
    echo "🔧 Setting up Node.js for first-time users..."
    echo "=================================="
    
    # Check if Homebrew is available
    if command -v brew &> /dev/null; then
        echo "✅ Homebrew found. Installing Node.js 18 via Homebrew..."
        echo "This may take a few minutes..."
        
        # Install Node.js 18 via Homebrew
        echo "⏳ Installing Node.js 18 via Homebrew (this may take 2-5 minutes)..."
        if brew install node@18; then
            echo "✅ Node.js 18 installed successfully via Homebrew"
            # Add to PATH for current session
            export PATH="/opt/homebrew/opt/node@18/bin:/usr/local/bin:$PATH"
        else
            echo "❌ Failed to install Node.js via Homebrew"
            echo "Falling back to manual installation..."
            echo ""
            # Continue to manual installation below
        fi
    else
        echo "❌ Homebrew not found. Installing Homebrew first..."
        echo "=================================="
        echo "🍺 This will install Homebrew, which is the recommended way to manage"
        echo "   development tools on macOS. It will then install Node.js automatically."
        echo ""
        echo "⏳ Installing Homebrew (this may take 3-5 minutes)..."
        echo "   You may be prompted for your password during installation."
        echo ""
        
        # Install Homebrew
        if /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"; then
            echo "✅ Homebrew installed successfully"
            
            # Add Homebrew to PATH for current session
            if [[ -f "/opt/homebrew/bin/brew" ]]; then
                # Apple Silicon Mac
                export PATH="/opt/homebrew/bin:$PATH"
                echo "📱 Detected Apple Silicon Mac - added Homebrew to PATH"
            elif [[ -f "/usr/local/bin/brew" ]]; then
                # Intel Mac
                export PATH="/usr/local/bin:$PATH"
                echo "💻 Detected Intel Mac - added Homebrew to PATH"
            fi
            
            # Verify Homebrew installation
            if command -v brew &> /dev/null; then
                echo "✅ Homebrew verified: $(brew --version | head -n1)"
                
                # Now install Node.js via Homebrew
                echo "⏳ Installing Node.js 18 via Homebrew (this may take 2-5 minutes)..."
                if brew install node@18; then
                    echo "✅ Node.js 18 installed successfully via Homebrew"
                    # Add Node.js to PATH for current session
                    if [[ -f "/opt/homebrew/opt/node@18/bin/node" ]]; then
                        export PATH="/opt/homebrew/opt/node@18/bin:$PATH"
                    elif [[ -f "/usr/local/opt/node@18/bin/node" ]]; then
                        export PATH="/usr/local/opt/node@18/bin:$PATH"
                    fi
                else
                    echo "❌ Failed to install Node.js via Homebrew"
                    echo "Falling back to manual installation..."
                    echo ""
                    # Continue to manual installation below
                fi
            else
                echo "❌ Homebrew installation failed or not found in PATH"
                echo "Falling back to manual Node.js installation..."
                echo ""
                # Continue to manual installation below
            fi
        else
            echo "❌ Failed to install Homebrew"
            echo "This might be due to network issues or permission problems."
            echo "Falling back to manual Node.js installation..."
            echo ""
            # Continue to manual installation below
        fi
    fi
    
    # Manual installation (if Homebrew failed or not available)
    if ! command -v node &> /dev/null; then
        echo "❌ Homebrew not found or failed. Attempting to install Node.js manually..."
        echo "=================================="
        
        # Detect system architecture
        ARCH=$(uname -m)
        if [[ "$ARCH" == "arm64" ]]; then
            NODE_ARCH="arm64"
            echo "📱 Detected Apple Silicon (ARM64) architecture"
        else
            NODE_ARCH="x64"
            echo "💻 Detected Intel (x64) architecture"
        fi
        
        # Set Node.js version (LTS)
        NODE_VERSION="18.19.0"
        NODE_URL="https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-darwin-${NODE_ARCH}.tar.gz"
        NODE_TAR="node-v${NODE_VERSION}-darwin-${NODE_ARCH}.tar.gz"
        NODE_DIR="node-v${NODE_VERSION}-darwin-${NODE_ARCH}"
        
        echo "📥 Downloading Node.js ${NODE_VERSION} for macOS ${NODE_ARCH}..."
        echo "URL: ${NODE_URL}"
        
        # Create temporary directory
        TEMP_DIR=$(mktemp -d)
        cd "$TEMP_DIR"
        
        # Download Node.js
        if curl -L -o "$NODE_TAR" "$NODE_URL"; then
            echo "✅ Node.js downloaded successfully"
            
            # Extract Node.js
            echo "📦 Extracting Node.js..."
            if tar -xzf "$NODE_TAR"; then
                echo "✅ Node.js extracted successfully"
                
                # Install Node.js to /usr/local
                echo "🔧 Installing Node.js to /usr/local..."
                sudo cp -r "$NODE_DIR"/* /usr/local/
                
                if [ $? -eq 0 ]; then
                    echo "✅ Node.js installed successfully to /usr/local"
                    # Add to PATH for current session
                    export PATH="/usr/local/bin:$PATH"
                else
                    echo "❌ Failed to install Node.js to /usr/local"
                    echo "Please try installing manually from: https://nodejs.org/"
                    read -p "Press Enter to exit..."
                    exit 1
                fi
            else
                echo "❌ Failed to extract Node.js"
                read -p "Press Enter to exit..."
                exit 1
            fi
        else
            echo "❌ Failed to download Node.js"
            echo "Please check your internet connection and try again"
            echo ""
            echo "🌐 Opening Node.js download page in your browser..."
            open "https://nodejs.org/en/download/"
            echo ""
            echo "Please download and install Node.js 18+ for macOS ${NODE_ARCH}, then run this script again."
            read -p "Press Enter to exit..."
            exit 1
        fi
        
        # Clean up
        cd "$SCRIPT_DIR"
        rm -rf "$TEMP_DIR"
    fi
    
    # Verify Node.js installation
    if command -v node &> /dev/null; then
        echo "✅ Node.js installation verified: $(node --version)"
    else
        echo "❌ Node.js installation failed. Please restart your terminal and try again."
        echo "Or install manually from: https://nodejs.org/"
        read -p "Press Enter to exit..."
        exit 1
    fi
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js and try again."
    read -p "Press Enter to exit..."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"

# Enhanced process cleanup - Force kill any existing FileMap processes
echo "🧹 Checking for existing FileMap processes..."
EXISTING_PROCESSES=$(pgrep -f "FileMap\|Electron.*FileMap\|node.*main.js" 2>/dev/null)

if [ ! -z "$EXISTING_PROCESSES" ]; then
    echo "⚠️  Found existing FileMap processes:"
    echo "$EXISTING_PROCESSES"
    echo "🔄 Force stopping existing processes..."
    
    # Force kill all related processes
    pkill -f "FileMap" 2>/dev/null
    pkill -f "Electron.*FileMap" 2>/dev/null
    pkill -f "node.*main.js" 2>/dev/null
    
    # Wait a moment for processes to fully terminate
    sleep 2
    
    # Double-check and force kill if still running
    REMAINING=$(pgrep -f "FileMap\|Electron.*FileMap\|node.*main.js" 2>/dev/null)
    if [ ! -z "$REMAINING" ]; then
        echo "🚨 Force killing remaining processes..."
        kill -9 $REMAINING 2>/dev/null
        sleep 1
    fi
    
    echo "✅ Process cleanup completed"
else
    echo "✅ No existing FileMap processes found"
fi

# Check if this is the first run by looking for a marker file
FIRST_RUN_MARKER="$SCRIPT_DIR/.first-run-complete"
REACT_FIRST_RUN_MARKER="$SCRIPT_DIR/../research-manager/.first-run-complete"

# Check if dependencies are already installed
if [ -d "node_modules" ] && [ -f "node_modules/.package-lock.json" ]; then
    echo "📦 Electron dependencies already installed, skipping npm install..."
else
    echo "📦 Installing Electron dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Electron dependencies. Please check your internet connection and try again."
        read -p "Press Enter to exit..."
        exit 1
    fi
    echo "✅ Electron dependencies installed successfully"
fi

# Check and install React dependencies if needed
if [ ! -f "$REACT_FIRST_RUN_MARKER" ]; then
    echo "📦 First run detected - installing React dependencies..."
    cd "$SCRIPT_DIR/research-manager"
    
    if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
        echo "📦 Installing React dependencies..."
        npm install
        if [ $? -ne 0 ]; then
            echo "❌ Failed to install React dependencies. Please check your internet connection and try again."
            read -p "Press Enter to exit..."
            exit 1
        fi
        echo "✅ React dependencies installed successfully"
    fi
    
    # Build the React app
    echo "🔨 Building React application..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Failed to build React application. Please check the error messages above."
        read -p "Press Enter to exit..."
        exit 1
    fi
    echo "✅ React application built successfully"
    
    # Create first run marker
    touch "$REACT_FIRST_RUN_MARKER"
    echo "✅ First run setup completed"
    
    # Return to electron directory
    cd "$SCRIPT_DIR/electron"
else
    echo "✅ React dependencies already installed, skipping first run setup..."
fi

# Ensure React build is available and up-to-date
echo "🔄 Checking React build..."
if [ ! -d "research-manager" ] || [ ! -f "research-manager/index.html" ]; then
    echo "📁 React build not found, copying from source..."
    if [ -d "../research-manager/build" ]; then
        rm -rf research-manager
        cp -r "../research-manager/build" research-manager
        echo "✅ React build copied successfully"
    else
        echo "❌ React build not found in ../research-manager/build"
        echo "Please run 'npm run build' in the research-manager directory first"
        read -p "Press Enter to exit..."
        exit 1
    fi
else
    # Check if the build is newer than the source
    if [ -d "../research-manager/build" ]; then
        SOURCE_TIME=$(stat -f "%m" "../research-manager/build")
        CURRENT_TIME=$(stat -f "%m" "research-manager")
        
        if [ $SOURCE_TIME -gt $CURRENT_TIME ]; then
            echo "📁 React build is outdated, updating..."
            rm -rf research-manager
            cp -r "../research-manager/build" research-manager
            echo "✅ React build updated successfully"
        else
            echo "✅ React build is up-to-date"
        fi
    else
        echo "✅ React build already available"
    fi
fi

# Create data directory if it doesn't exist
DATA_DIR="$HOME/Library/Application Support/FileMap"
if [ ! -d "$DATA_DIR" ]; then
    echo "📁 Creating data directory: $DATA_DIR"
    mkdir -p "$DATA_DIR"
fi

# Final check for any remaining processes
echo "🔍 Final process check..."
FINAL_CHECK=$(pgrep -f "FileMap\|Electron.*FileMap\|node.*main.js" 2>/dev/null)
if [ ! -z "$FINAL_CHECK" ]; then
    echo "⚠️  Warning: Some processes may still be running:"
    echo "$FINAL_CHECK"
    echo "This might cause issues. Consider restarting your computer if problems persist."
    read -p "Press Enter to continue anyway..."
fi

# Handle macOS Security Warning
echo "🔒 Checking for macOS security warnings..."
echo "=================================="

# Check if this is a built app and handle security warning
if [ -d "dist/mac/FileMap.app" ]; then
    echo "📱 Found built FileMap.app - checking for security issues..."
    
    # Remove quarantine attribute
    if xattr -l "dist/mac/FileMap.app" 2>/dev/null | grep -q "com.apple.quarantine"; then
        echo "⚠️  Removing quarantine attribute..."
        xattr -d com.apple.quarantine "dist/mac/FileMap.app" 2>/dev/null || true
        echo "✅ Quarantine attribute removed"
    fi
    
    # Check if app is approved by Gatekeeper
    if ! spctl --assess --verbose "dist/mac/FileMap.app" 2>/dev/null; then
        echo "⚠️  FileMap is not approved by Gatekeeper"
        echo "🔧 Attempting to add to approved applications..."
        
        # Try to add to approved apps
        if spctl --add "dist/mac/FileMap.app" 2>/dev/null; then
            echo "✅ FileMap added to approved applications"
        else
            echo "❌ Could not automatically approve FileMap"
            echo ""
            echo "🔧 Manual fix required:"
            echo "1. Right-click on FileMap.app in the dist/mac/ folder"
            echo "2. Select 'Open' from the context menu"
            echo "3. Click 'Open' in the security dialog"
            echo "4. FileMap will be added to your approved applications"
            echo ""
            read -p "Press Enter after completing the manual fix..."
        fi
    else
        echo "✅ FileMap is already approved by Gatekeeper"
    fi
fi

# Start the application
echo "🎯 Launching FileMap..."
echo "=================================="
echo "💡 Tip: Your data will be automatically saved to:"
echo "   $DATA_DIR/research-manager-data.json"
echo "💾 Auto-save: Every 10 seconds + on app close"
echo "🚨 Force save: Immediate save when closing the app"
echo "=================================="

# Run the app and capture any errors
if npm start; then
    echo "✅ FileMap closed successfully"
else
    echo "❌ FileMap encountered an error"
    echo "Check the console output above for details"
    
    # Additional cleanup on error
    echo "🧹 Cleaning up after error..."
    pkill -f "FileMap" 2>/dev/null
    pkill -f "Electron.*FileMap" 2>/dev/null
    
    read -p "Press Enter to exit..."
fi
