const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  selectFile: () => ipcRenderer.invoke('select-file'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  openFile: (filePath) => ipcRenderer.invoke('open-file', filePath),
  validateFile: (filePath) => ipcRenderer.invoke('validate-file', filePath),
  getFileInfo: (filePath) => ipcRenderer.invoke('get-file-info', filePath),
  
  // Data persistence
  loadData: () => ipcRenderer.invoke('load-data'),
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  manualSave: (data) => ipcRenderer.invoke('manual-save', data),
  
  // Auto-save functionality
  onRequestDataForSave: (callback) => ipcRenderer.on('request-data-for-save', callback),
  sendDataForAutoSave: (data) => ipcRenderer.send('auto-save-data', data),
  
  // Force save functionality (for app close)
  onForceSaveRequest: (callback) => ipcRenderer.on('force-save-request', callback),
  sendForceSaveData: (data) => ipcRenderer.send('force-save-data', data),
  
  // Platform info
  platform: process.platform,
  isElectron: true
});
