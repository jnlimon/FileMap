const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');
const fileUtils = require('./fileUtils');
const fs = require('fs');

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  try {
    console.log('🚫 Another instance is already running, quitting...');
  } catch (e) {
    // Silently handle console errors
  }
  app.quit();
  return;
}

// Data storage functions (will be initialized after app is ready)
let dataFilePath;
let autoSaveInterval;
let lastSavedData = null;

// Define storage functions at module level
function loadData() {
  try {
    console.log('🔍 loadData() called with dataFilePath:', dataFilePath);
  } catch (e) {
    // Silently handle console errors
  }
  
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      try {
        console.log('📥 Loaded data from file:', dataFilePath);
        console.log('📦 File contents:', data);
      } catch (e) {
        // Silently handle console errors
      }
      return JSON.parse(data);
    } else {
      try {
        console.log('❌ File does not exist:', dataFilePath);
      } catch (e) {
        // Silently handle console errors
      }
    }
  } catch (error) {
    try {
      console.error('❌ Error loading data:', error);
    } catch (e) {
      // Silently handle console errors
    }
  }
  
  // Return default data if file doesn't exist or error
  const defaultData = {
    projects: [],
    currentProject: null,
    searchQuery: '',
    filters: { query: '', tags: [] }
  };
  
  try {
    console.log('🆕 Using default data:', defaultData);
  } catch (e) {
    // Silently handle console errors
  }
  return defaultData;
}

function saveData(data) {
  try {
    console.log('💾 saveData() called with dataFilePath:', dataFilePath);
    console.log('💾 Data to save:', JSON.stringify(data, null, 2));
  } catch (e) {
    // Silently handle console errors
  }
  
  try {
    const dataDir = path.dirname(dataFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      try {
        console.log('📁 Created directory:', dataDir);
      } catch (e) {
        // Silently handle console errors
      }
    }
    
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    try {
      console.log('💾 Data saved to file:', dataFilePath);
    } catch (e) {
      // Silently handle console errors
    }
    
    // Verify the file was created
    if (fs.existsSync(dataFilePath)) {
      try {
        console.log('✅ File exists after saving');
        const savedData = fs.readFileSync(dataFilePath, 'utf8');
        console.log('✅ File contents after saving:', savedData);
      } catch (e) {
        // Silently handle console errors
      }
    } else {
      try {
        console.log('❌ File does not exist after saving!');
      } catch (e) {
        // Silently handle console errors
      }
    }
    
    return true;
  } catch (error) {
    try {
      console.error('❌ Error saving data:', error);
    } catch (e) {
      // Silently handle console errors
    }
    return false;
  }
}

function initializeStorage() {
  // Data storage file path
  dataFilePath = path.join(app.getPath('userData'), 'research-manager-data.json');
  
  // Log the data file path for debugging
  try {
    console.log('📁 Data file path:', dataFilePath);
  } catch (e) {
    // Silently handle console errors
  }
  const initialData = loadData();
  try {
    console.log('📦 Initial data contents:', initialData);
  } catch (e) {
    // Silently handle console errors
  }
  lastSavedData = JSON.stringify(initialData);
  
  // Set up auto-save every 10 seconds
  autoSaveInterval = setInterval(() => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      // Request current data from renderer process
      mainWindow.webContents.send('request-data-for-save');
    }
  }, 10000); // 10 seconds
  
  try {
    console.log('⏰ Auto-save enabled (every 10 seconds)');
  } catch (e) {
    // Silently handle console errors
  }
}

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    title: 'FileMap',
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true, // Enable web security
      allowRunningInsecureContent: false, // Disallow insecure content
      preload: path.join(__dirname, 'preload.js') // Add preload script
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    titleBarStyle: 'default',
    show: false // Don't show until ready
  });

  // Simple approach: Load directly from the build directory
  try {
    console.log('🚀 Loading React app directly from build directory...');
  } catch (e) {
    // Silently handle console errors
  }
  
  const buildPath = path.join(__dirname, 'research-manager');
  const indexPath = path.join(buildPath, 'index.html');
  
  try {
    console.log('📁 Build path:', buildPath);
    console.log('📄 Index file:', indexPath);
  } catch (e) {
    // Silently handle console errors
  }
  
  // Load the app directly from the file system
  mainWindow.loadFile(indexPath);

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // DevTools are now disabled by default for production use
    // To open DevTools manually: Cmd+Option+I (macOS) or Ctrl+Shift+I (Windows/Linux)
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Prevent new window creation
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Open external URLs in default browser
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Set up IPC handlers for file operations and data persistence
function setupIpcHandlers() {
  // File selection
  ipcMain.handle('select-file', async () => {
    return await fileUtils.selectFile();
  });

  // Folder selection
  ipcMain.handle('select-folder', async () => {
    return await fileUtils.selectFolder();
  });

  // File opening
  ipcMain.handle('open-file', async (event, filePath) => {
    return await fileUtils.openFile(filePath);
  });

  // File validation
  ipcMain.handle('validate-file', async (event, filePath) => {
    return fileUtils.validateFilePath(filePath);
  });

  // Get file info
  ipcMain.handle('get-file-info', async (event, filePath) => {
    return fileUtils.getFileInfo(filePath);
  });

  // Data persistence - Load data from file
  ipcMain.handle('load-data', async () => {
    try {
      console.log('📥 Loading data from file system...');
    } catch (e) {
      // Silently handle console errors
    }
    return loadData();
  });

  // Data persistence - Save data to file
  ipcMain.handle('save-data', async (event, data) => {
    try {
      console.log('💾 Saving data to file system:', data);
    } catch (e) {
      // Silently handle console errors
    }
    return saveData(data);
  });

  // Handle manual save request
  ipcMain.handle('manual-save', async (event, data) => {
    try {
      try {
        console.log('💾 Manual save requested...');
      } catch (e) {
        // Silently handle console errors
      }
      return saveData(data);
    } catch (e) {
      // Silently handle manual save errors
      return false;
    }
  });
  
  // Handle auto-save data request from renderer
  ipcMain.on('auto-save-data', (event, data) => {
    try {
      autoSave(data);
    } catch (e) {
      // Silently handle auto-save errors
    }
  });
  
  // Handle force save request (for app close)
  ipcMain.on('force-save-data', (event, data) => {
    try {
      if (data) {
        saveData(data);
      }
    } catch (e) {
      // Silently handle any errors during force save
    }
  });
}

// Auto-save function that only saves if data has changed
function autoSave(data) {
  if (!data) return;
  
  try {
    const currentDataString = JSON.stringify(data);
    if (currentDataString !== lastSavedData) {
      try {
        console.log('🔄 Auto-saving data (data has changed)...');
      } catch (e) {
        // Silently handle console errors
      }
      saveData(data);
      lastSavedData = currentDataString;
    } else {
      try {
        console.log('⏭️  Skipping auto-save (no changes detected)');
      } catch (e) {
        // Silently handle console errors
      }
    }
  } catch (e) {
    // Silently handle auto-save errors
  }
}

// Cleanup function with error handling to prevent EIO errors
function cleanup() {
  try {
    // Clear auto-save interval
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval);
    }
    
    // Force save any pending data immediately
    if (mainWindow && !mainWindow.isDestroyed()) {
      try {
        mainWindow.webContents.send('request-data-for-save');
        
        // Give a moment for the save to complete
        setTimeout(() => {
          // Cleanup completed - no console logging during shutdown
        }, 1500);
      } catch (e) {
        // Silently handle errors during cleanup
      }
    }
  } catch (e) {
    // Silently handle any cleanup errors
  }
}

// Enhanced cleanup with immediate save
function forceSaveBeforeQuit() {
  try {
    // Clear auto-save interval
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval);
    }
    
    // Try to save immediately if we have a window
    if (mainWindow && !mainWindow.isDestroyed()) {
      try {
        // Request data and save it immediately
        mainWindow.webContents.send('force-save-request');
        
        // Wait a bit longer for the save to complete
        setTimeout(() => {
          // Force save completed - no console logging during shutdown
        }, 2000);
      } catch (e) {
        // Silently handle errors during cleanup
      }
    }
  } catch (e) {
    // Silently handle any cleanup errors
  }
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  try {
    console.log('🚀 FileMap app is ready, setting up...');
  } catch (e) {
    // Silently handle console errors
  }
  
  // Set app name for macOS dock and menu bar
  app.setName('FileMap');
  
  initializeStorage(); // Initialize file-based storage
  setupIpcHandlers();
  createWindow();
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    forceSaveBeforeQuit();
    cleanup();
    app.quit();
  }
});

// Handle app quit with enhanced save
app.on('before-quit', (event) => {
  try {
    // Prevent immediate quit to allow save to complete
    event.preventDefault();
    
    // Force save and then quit
    forceSaveBeforeQuit();
    
    // Wait for save to complete, then quit
    setTimeout(() => {
      cleanup();
      app.quit();
    }, 2500);
  } catch (e) {
    // If cleanup fails, still quit
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create window when dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Security: Prevent navigation to external URLs
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    // Only allow navigation within the local server
    if (parsedUrl.origin !== 'http://localhost') {
      event.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });
});
