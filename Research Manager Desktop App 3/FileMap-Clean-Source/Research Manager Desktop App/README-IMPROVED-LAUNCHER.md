# FileMap Improved Launcher - Complete Guide

## 🚀 Overview

This improved version of the FileMap launcher addresses the key issues users were experiencing:

1. **Resource Re-downloading** - Dependencies are now only installed once
2. **Data Persistence** - Changes are automatically saved and persist between sessions
3. **Better Error Handling** - Improved user feedback and error recovery
4. **Auto-save Functionality** - Data is automatically saved every 30 seconds

## 🔧 What's Fixed

### 1. Resource Management
- **Smart Dependency Checking**: The launcher now checks if `node_modules` already exists before running `npm install`
- **Build Verification**: Automatically detects if the React build is outdated and updates it
- **Efficient Resource Usage**: Only downloads/installs what's necessary

### 2. Data Persistence
- **Auto-save**: Data is automatically saved every 30 seconds
- **Session Persistence**: All changes are saved to `~/Library/Application Support/FileMap/`
- **Proper Cleanup**: Data is saved when the app closes or crashes
- **Change Detection**: Only saves when data has actually changed

### 3. User Experience
- **Better Feedback**: Clear status messages throughout the process
- **Error Recovery**: Helpful error messages with suggestions
- **Progress Tracking**: Visual indicators for each step
- **Running App Detection**: Warns if FileMap is already running

## 📁 File Structure

```
Research Manager Desktop App/
├── FileMap-Launcher.command          # Main launcher script
├── electron/
│   ├── main.js                      # Enhanced main process with auto-save
│   ├── preload.js                   # Updated preload with new APIs
│   ├── package-app-final.sh         # Comprehensive packaging script
│   └── research-manager/            # React build (auto-copied)
├── research-manager/                 # Source React app
└── README-IMPROVED-LAUNCHER.md      # This file
```

## 🚀 How to Use

### Option 1: Use the Launcher Script (Recommended)
1. Double-click `FileMap-Launcher.command`
2. The script will automatically:
   - Check for Node.js and npm
   - Install dependencies (only if needed)
   - Copy/update the React build
   - Launch the application
3. Your data will be automatically saved

### Option 2: Create a Packaged App
1. Navigate to the `electron` directory
2. Run the packaging script:
   ```bash
   cd electron
   ./package-app-final.sh
   ```
3. This creates `FileMap-Final.app` which you can:
   - Copy to `/Applications/`
   - Run directly by double-clicking
   - Distribute to other users

## 💾 Data Storage

Your research data is automatically saved to:
```
~/Library/Application Support/FileMap/research-manager-data.json
```

**Features:**
- Auto-saves every 30 seconds
- Saves on app close
- Saves on manual save requests
- Only saves when data changes
- Persistent between app sessions

## 🔧 Technical Details

### Auto-save Implementation
- **Interval-based**: Triggers every 30 seconds
- **Change Detection**: Only saves if data has actually changed
- **Renderer Communication**: Uses IPC to request current data from React
- **Error Handling**: Graceful fallback if auto-save fails

### Data Persistence Flow
1. App loads data from file on startup
2. User makes changes in the interface
3. Auto-save triggers every 30 seconds
4. Manual save available on demand
5. Final save on app close
6. Data loaded on next startup

### IPC Communication
- `load-data`: Load data from file
- `save-data`: Save data to file
- `manual-save`: Force immediate save
- `auto-save-data`: Handle auto-save requests
- `request-data-for-save`: Request current data from renderer

## 🐛 Troubleshooting

### Common Issues

**"Node.js not found"**
- Install Node.js 18+ from https://nodejs.org/
- Or use Homebrew: `brew install node@18`

**"npm not found"**
- Usually fixed by installing Node.js
- Ensure PATH includes npm

**"React build not found"**
- Run `npm run build` in the `research-manager` directory
- The launcher will attempt to do this automatically

**Data not persisting**
- Check console for error messages
- Verify write permissions to `~/Library/Application Support/`
- Check if the data file exists and is readable

### Debug Mode
The app automatically opens DevTools after 1 second. Check the console for:
- Data loading/saving messages
- Auto-save activity
- Error messages
- File path information

## 🔄 Updating

### Update React App
1. Make changes in `research-manager/src/`
2. Run `npm run build` in `research-manager/`
3. Restart FileMap - the launcher will automatically detect and copy the new build

### Update Dependencies
1. Delete `electron/node_modules/`
2. Run the launcher again - it will reinstall dependencies

## 📦 Distribution

### For End Users
- Provide `FileMap-Launcher.command` and the entire project folder
- Users just need to double-click the launcher

### For Distribution
- Use `package-app-final.sh` to create a standalone `.app`
- The `.app` contains everything needed to run
- Can be copied to `/Applications/` or distributed as a zip

## 🎯 Best Practices

1. **Always use the launcher script** for development
2. **Test data persistence** by making changes and restarting
3. **Check console output** for any error messages
4. **Use the packaged app** for distribution to end users
5. **Backup the data file** if you have important research data

## 🔮 Future Improvements

- [ ] Configurable auto-save interval
- [ ] Backup/restore functionality
- [ ] Data export/import options
- [ ] Cloud sync integration
- [ ] Multiple data file support

## 📞 Support

If you encounter issues:
1. Check the console output for error messages
2. Verify all dependencies are installed
3. Ensure proper file permissions
4. Check the troubleshooting section above

---

**Version**: 1.0.0  
**Last Updated**: August 2024  
**Compatibility**: macOS 10.15+ (Catalina and later)

