const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  console.log('Creating window...');
  
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  console.log('Loading test page...');
  
  // Load a simple test page instead of the React app
  mainWindow.loadURL('data:text/html,<html><body><h1>FileMap Test</h1><p>If you see this, Electron is working!</p></body></html>');
  
  console.log('Window created successfully');
}

app.whenReady().then(() => {
  console.log('App is ready, creating window...');
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
