const { app, BrowserWindow, shell, ipcMain } = require('electron');
const path = require('path');
const fileUtils = require('./fileUtils');
const fs = require('fs');

// Safe logging function that prevents EIO errors during shutdown
let isShuttingDown = false;
function safeLog(...args) {
  if (!isShuttingDown) {
    try {
      console.log(...args);
    } catch (e) {
      // Silently handle console errors during shutdown
    }
  }
}

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  safeLog('🚫 Another instance is already running, quitting...');
  app.quit();
  return;
}

// Data storage functions (will be initialized after app is ready)
let dataFilePath;
let autoSaveInterval;
let lastSavedData = null;

// Define storage functions at module level
function loadData() {
  safeLog('🔍 loadData() called with dataFilePath:', dataFilePath);
  
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      safeLog('📥 Loaded data from file:', dataFilePath);
      safeLog('📦 File contents:', data);
      return JSON.parse(data);
    } else {
      safeLog('❌ File does not exist:', dataFilePath);
    }
  } catch (error) {
    safeLog('❌ Error loading data:', error);
  }
  
  // Return default data if file doesn't exist or error
  const defaultData = {
    projects: [],
    currentProject: null,
    searchQuery: '',
    filters: { query: '', tags: [] }
  };
  
  safeLog('🆕 Using default data:', defaultData);
  return defaultData;
}

function saveData(data) {
  safeLog('💾 saveData() called with dataFilePath:', dataFilePath);
  safeLog('💾 Data to save:', JSON.stringify(data, null, 2));
  
  try {
    const dataDir = path.dirname(dataFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      safeLog('📁 Created directory:', dataDir);
    }
    
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    safeLog('💾 Data saved to file:', dataFilePath);
    
    // Verify the file was created
    if (fs.existsSync(dataFilePath)) {
      safeLog('✅ File exists after saving');
      const savedData = fs.readFileSync(dataFilePath, 'utf8');
      safeLog('✅ File contents after saving:', savedData);
    } else {
      safeLog('❌ File does not exist after saving!');
    }
    
    return true;
  } catch (error) {
    safeLog('❌ Error saving data:', error);
    return false;
  }
}

function initializeStorage() {
  // Data storage file path
  dataFilePath = path.join(app.getPath('userData'), 'research-manager-data.json');
  
  // Log the data file path for debugging
  safeLog('📁 Data file path:', dataFilePath);
  const initialData = loadData();
  safeLog('📦 Initial data contents:', initialData);
  lastSavedData = JSON.stringify(initialData);
  
  // Set up auto-save every 10 seconds
  autoSaveInterval = setInterval(() => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      // Request current data from renderer process
      mainWindow.webContents.send('request-data-for-save');
    }
  }, 10000); // 10 seconds
  
  safeLog('⏰ Auto-save enabled (every 10 seconds)');
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
  const buildPath = path.join(__dirname, 'research-manager');
  const indexPath = path.join(buildPath, 'index.html');
  
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
    safeLog('📥 Loading data from file system...');
    return loadData();
  });

  // Data persistence - Save data to file
  ipcMain.handle('save-data', async (event, data) => {
    safeLog('💾 Saving data to file system:', data);
    return saveData(data);
  });

  // Handle manual save request
  ipcMain.handle('manual-save', async (event, data) => {
    try {
      safeLog('💾 Manual save requested...');
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
      safeLog('🔄 Auto-saving data (data has changed)...');
      saveData(data);
      lastSavedData = currentDataString;
    } else {
      safeLog('⏭️  Skipping auto-save (no changes detected)');
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
  safeLog('🚀 FileMap app is ready, setting up...');
  
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
    // Set shutdown flag to prevent console logging
    isShuttingDown = true;
    
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
