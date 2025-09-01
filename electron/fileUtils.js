const { dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

// File selection without popups
async function selectFile() {
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'All Files', extensions: ['*'] },
        { name: 'Documents', extensions: ['pdf', 'doc', 'docx', 'txt', 'rtf'] },
        { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'] },
        { name: 'Data Files', extensions: ['csv', 'xlsx', 'xls', 'json', 'xml'] },
        { name: 'Code Files', extensions: ['py', 'js', 'ts', 'cpp', 'c', 'java'] }
      ]
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const filePath = result.filePaths[0];
      const fileName = path.basename(filePath);
      return { filePath, fileName };
    }
    return null;
  } catch (error) {
    console.error('Error selecting file:', error);
    return null;
  }
}

// Folder selection without popups
async function selectFolder() {
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Select Folder'
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const folderPath = result.filePaths[0];
      const folderName = path.basename(folderPath);
      return { folderPath, folderName };
    }
    return null;
  } catch (error) {
    console.error('Error selecting folder:', error);
    return null;
  }
}

// Open file in native application
async function openFile(filePath) {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath);
      return false;
    }
    
    // Open file with default application
    await shell.openPath(filePath);
    return true;
  } catch (error) {
    console.error('Error opening file:', error);
    
    // If shell.openPath fails, try to show the file in Finder/Explorer
    try {
      if (process.platform === 'darwin') {
        // macOS: Show in Finder
        await shell.openPath(path.dirname(filePath));
      } else if (process.platform === 'win32') {
        // Windows: Show in Explorer
        await shell.openPath(path.dirname(filePath));
      } else {
        // Linux: Show in file manager
        await shell.openPath(path.dirname(filePath));
      }
      return true;
    } catch (fallbackError) {
      console.error('Fallback file opening also failed:', fallbackError);
      return false;
    }
  }
}

// Validate file path
function validateFilePath(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

// Get file info
function getFileInfo(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const stats = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    return {
      name: path.basename(filePath),
      size: stats.size,
      extension: ext,
      modified: stats.mtime,
      isDirectory: stats.isDirectory()
    };
  } catch (error) {
    console.error('Error getting file info:', error);
    return null;
  }
}

module.exports = {
  selectFile,
  selectFolder,
  openFile,
  validateFilePath,
  getFileInfo
};
