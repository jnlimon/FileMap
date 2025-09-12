# Research Manager Desktop App

A powerful desktop application for managing research files, built with Electron and React.

## 🚀 Quick Start

### Prerequisites
- **macOS** (tested on macOS 10.15+)
- **Node.js 18+** ([Download here](https://nodejs.org/) or install via Homebrew: `brew install node@18`)

### Installation & First Run

1. **Download the source code**
   ```bash
   git clone https://github.com/yourusername/research-manager-desktop-app.git
   cd research-manager-desktop-app
   ```

2. **Run the application**
   - Double-click `FileMap-Launcher.command` in Finder, or
   - Run from terminal: `./FileMap-Launcher.command`

3. **First run setup**
   - The app will automatically detect this is your first run
   - It will install all required dependencies (this may take a few minutes)
   - The React frontend will be built automatically
   - Subsequent runs will be much faster!

### What happens on first run?
- ✅ Installs Electron dependencies
- ✅ Installs React dependencies  
- ✅ Builds the React frontend
- ✅ Creates necessary data directories
- ✅ Sets up auto-save functionality

### What happens on subsequent runs?
- ✅ Skips dependency installation (much faster!)
- ✅ Checks for React build updates
- ✅ Launches the application directly

## 📁 Project Structure

```
research-manager-desktop-app/
├── FileMap-Launcher.command    # Main launcher script
├── electron/                   # Electron main process
│   ├── main.js                # Main Electron process
│   ├── preload.js             # Preload script
│   ├── fileUtils.js           # File utilities
│   └── package.json           # Electron dependencies
├── research-manager/           # React frontend
│   ├── src/                   # React source code
│   ├── public/                # Static assets
│   └── package.json           # React dependencies
└── README.md                  # This file
```

## 🔧 Development

### Prerequisites for Development
- Node.js 18+
- npm

### Running in Development Mode
```bash
# Install dependencies
cd electron && npm install
cd ../research-manager && npm install

# Run React development server
cd research-manager && npm start

# In another terminal, run Electron
cd electron && npm run dev
```

### Building for Production
```bash
# Build React app
cd research-manager && npm run build

# Package Electron app
cd electron && npm run dist
```

## 📊 Features

- **File Management**: Organize and categorize research files
- **Auto-save**: Automatic saving every 10 seconds + on app close
- **Cross-platform**: Built with Electron for desktop compatibility
- **Modern UI**: React-based interface with Tailwind CSS
- **Data Persistence**: Local data storage with automatic backup

## 🗂️ Data Storage

Your data is automatically saved to:
```
~/Library/Application Support/FileMap/research-manager-data.json
```

## 🐛 Troubleshooting

### Common Issues

**"Node.js not found" error**
- Install Node.js 18+ from [nodejs.org](https://nodejs.org/)
- Or via Homebrew: `brew install node@18`

**"npm not found" error**
- Node.js installation includes npm
- Reinstall Node.js if npm is missing

**App won't start after first run**
- Check if you have the required Node.js version
- Try deleting the `.first-run-complete` files and running again
- Check the terminal output for specific error messages

**Dependencies installation fails**
- Check your internet connection
- Try running `npm install` manually in both `electron/` and `research-manager/` directories

### Reset to First Run
If you need to reset the app to first-run state:
```bash
rm .first-run-complete
rm research-manager/.first-run-complete
rm -rf electron/node_modules
rm -rf research-manager/node_modules
rm -rf research-manager/build
```

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Search existing issues on GitHub
3. Create a new issue with detailed information about your problem

---

**Note**: This app is designed to work offline after the initial setup. All dependencies are installed locally and no internet connection is required for normal operation.