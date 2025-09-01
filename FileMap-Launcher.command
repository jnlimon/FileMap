#!/bin/bash

# FileMap Launcher for macOS
echo "🚀 Starting FileMap..."
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
    echo "❌ Node.js not found. Please install Node.js 18+ and try again."
    echo "You can download it from: https://nodejs.org/"
    echo "Or install via Homebrew: brew install node@18"
    read -p "Press Enter to exit..."
    exit 1
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

# Check if dependencies are already installed
if [ -d "node_modules" ] && [ -f "node_modules/.package-lock.json" ]; then
    echo "📦 Dependencies already installed, skipping npm install..."
else
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies. Please check your internet connection and try again."
        read -p "Press Enter to exit..."
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
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
