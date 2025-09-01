# FileMap - Research Manager Desktop App

## 🚀 Quick Start

### What You Need
- **macOS** (tested on macOS 12+)
- **Node.js 18+** (download from [nodejs.org](https://nodejs.org/))

### How to Run

1. **Download and Extract**
   - Extract this zip file to any folder
   - Double-click `FileMap-Launcher.command`

2. **First Time Setup**
   - The app will automatically install dependencies
   - This may take 2-3 minutes on first run
   - Future launches will be much faster

3. **Using the App**
   - Create and manage research projects
   - Add experiments and data
   - Search and filter your research
   - Data automatically saves every 10 seconds

### 📁 What's Included
- **Source code** for the React frontend
- **Electron backend** for desktop functionality
- **Launcher script** that handles everything automatically
- **All fixes** for data persistence and error handling

### 🔧 Manual Setup (Advanced Users)
If you prefer to build from source:

```bash
# Install dependencies
npm install

# Build React app
cd research-manager
npm install
npm run build
cd ..

# Start Electron app
cd electron
npm install
npm start
```

### 💾 Data Storage
Your data is automatically saved to:
- **macOS:** `~/Library/Application Support/FileMap/`

### 🆘 Troubleshooting
- **"Node.js not found"** → Install Node.js from [nodejs.org](https://nodejs.org/)
- **"Port already in use"** → The launcher will automatically fix this
- **Data not saving** → App saves automatically every 10 seconds + on close

### 🎯 Features
- ✅ **Auto-save** every 10 seconds
- ✅ **Force save** on app close
- ✅ **Process management** (no conflicts)
- ✅ **Error-free operation**
- ✅ **Professional UI** (no DevTools popup)

---
**Made with ❤️ using Electron + React**
