# FileMap - Desktop Research File Management

A powerful desktop application for managing research files, experiments, and data using Electron and React.

## 🚀 Features

- **Smart File Management** - Organize research files with tags and metadata
- **Experiment Tracking** - Link experiments to files and track progress
- **Auto-save** - Data automatically saves every 10 seconds and on app close
- **Cross-platform** - Works on macOS, Windows, and Linux
- **Modern UI** - Built with React and Tailwind CSS

## 📦 Quick Start

### Option 1: Download and Run (Recommended)

1. **Download the source code** from this repository
2. **Extract the zip file** to a folder on your computer
3. **Double-click `FileMap-Launcher.command`** (macOS) or run the appropriate launcher for your OS
4. **The app will automatically:**
   - Install dependencies (only once)
   - Build the React application
   - Launch FileMap

### Option 2: Manual Setup

1. **Install Node.js 18+** from [nodejs.org](https://nodejs.org/)
2. **Clone or download** this repository
3. **Install dependencies:**
   ```bash
   npm install
   cd research-manager
   npm install
   npm run build
   ```
4. **Launch the app:**
   ```bash
   cd electron
   npm start
   ```

## 🔧 Requirements

- **Node.js 18+** and npm
- **macOS 10.15+** (Catalina and later)
- **Windows 10+** or **Linux** (Ubuntu 18.04+)

## 💾 Data Persistence

Your research data is automatically saved to:
- **macOS**: `~/Library/Application Support/FileMap/`
- **Windows**: `%APPDATA%/FileMap/`
- **Linux**: `~/.config/FileMap/`

**Features:**
- ✅ Auto-saves every 10 seconds
- ✅ Saves immediately when closing the app
- ✅ Data persists between sessions
- ✅ Change detection (only saves when needed)

## 🏗️ Project Structure

```
FileMap/
├── FileMap-Launcher.command    # Main launcher script
├── electron/                   # Electron main process
│   ├── main.js                # Main process with auto-save
│   ├── preload.js             # Preload script
│   ├── fileUtils.js           # File operations
│   └── package.json           # Electron dependencies
├── research-manager/           # React application
│   ├── src/                   # Source code
│   ├── public/                # Public assets
│   └── package.json           # React dependencies
├── assets/                     # App icons and images
└── README.md                   # This file
```

## 🎯 Usage

1. **Launch the app** using the launcher script
2. **Create projects** to organize your research
3. **Add files** by dragging and dropping or using the file picker
4. **Tag and categorize** your files for easy searching
5. **Link experiments** to track research progress
6. **Search and filter** through your research collection

## 🔄 Auto-save Features

- **Frequent saves**: Every 10 seconds
- **Immediate save on close**: No data loss when closing the app
- **Change detection**: Only saves when data has actually changed
- **Crash recovery**: Data is saved even if the app crashes

## 🐛 Troubleshooting

### Common Issues

**"Node.js not found"**
- Install Node.js 18+ from [nodejs.org](https://nodejs.org/)
- Or use Homebrew: `brew install node@18`

**"npm not found"**
- Usually fixed by installing Node.js
- Ensure PATH includes npm

**Data not persisting**
- Check console for error messages
- Verify write permissions to the data directory
- Check if the data file exists and is readable

### Debug Mode

The app automatically opens DevTools after 1 second. Check the console for:
- Data loading/saving messages
- Auto-save activity
- Error messages
- File path information

## 🚀 Development

### Building from Source

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd FileMap
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd research-manager
   npm install
   ```

3. **Build the React app:**
   ```bash
   npm run build
   ```

4. **Launch in development mode:**
   ```bash
   cd ../electron
   npm run dev
   ```

### Creating a Packaged App

1. **Navigate to the electron directory:**
   ```bash
   cd electron
   ```

2. **Run the packaging script:**
   ```bash
   ./package-app-final.sh
   ```

3. **This creates a standalone app** that can be distributed

## 📋 What's Fixed

This version addresses key issues from previous releases:

1. **✅ Resource Re-downloading** - Dependencies only install once
2. **✅ Data Persistence** - Changes automatically save and persist
3. **✅ Better Error Handling** - Improved user feedback and recovery
4. **✅ Auto-save Functionality** - Data saved every 10 seconds + on close

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter issues:
1. Check the console output for error messages
2. Verify all dependencies are installed
3. Ensure proper file permissions
4. Check the troubleshooting section above

---

**Version**: 1.0.0  
**Last Updated**: August 2024  
**Compatibility**: macOS 10.15+, Windows 10+, Ubuntu 18.04+