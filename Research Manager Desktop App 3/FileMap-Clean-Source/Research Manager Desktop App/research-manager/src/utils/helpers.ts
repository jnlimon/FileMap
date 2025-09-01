export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function formatDate(date: Date | string): string {
  // If it's a string, convert it to a Date object
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

// Check if we're running in Electron
function isElectron(): boolean {
  return !!(window as any).electronAPI;
}

// Check if File System Access API is supported
function isFileSystemAccessSupported(): boolean {
  return 'showOpenFilePicker' in window;
}

// Store file handles for persistent access
const fileHandles = new Map<string, any>();

export async function openFile(filePath: string, fileName: string): Promise<void> {
  try {
    // If we're in Electron, use native file opening
    if (isElectron()) {
      const success = await (window as any).electronAPI.openFile(filePath);
      if (!success) {
        console.error('Failed to open file:', filePath);
      }
      return;
    }

    // If it's a blob URL (file we selected), try to open it
    if (filePath.startsWith('blob:')) {
      // For blob URLs, we can open them directly
      if (fileName.match(/\.(png|jpg|jpeg|gif|bmp|webp|pdf|txt|html|css|js|json|xml|svg)$/i)) {
        // These file types can be opened in the browser
        window.open(filePath, '_blank');
      } else {
        // For other file types, download the file
        const link = document.createElement('a');
        link.href = filePath;
        link.download = fileName;
        link.click();
      }
      return;
    }
    
    // If it's an external URL, open in new tab
    if (filePath.startsWith('http') || filePath.startsWith('https')) {
      window.open(filePath, '_blank');
      return;
    }
    
    // If it's a file handle path, try to open with permission
    if (filePath.startsWith('file://')) {
      const fileHandle = fileHandles.get(filePath);
      if (fileHandle) {
        try {
          // Request permission to read the file
          const permission = await fileHandle.requestPermission({ mode: 'read' });
          
          if (permission === 'granted') {
            // Get the file
            const file = await fileHandle.getFile();
            
            // Create a blob URL and open it
            const blobUrl = URL.createObjectURL(file);
            
            // Try to open in new tab first (for supported formats)
            if (file.type.startsWith('image/') || file.type.startsWith('text/') || file.type === 'application/pdf') {
              window.open(blobUrl, '_blank');
            } else {
              // For other file types, show clear explanation
              const fileType = file.type || fileName.split('.').pop()?.toUpperCase() || 'Unknown';
              const result = window.confirm(
                `File: ${fileName}\n\nThis is a ${fileType} file that cannot be opened directly in the browser.\n\n` +
                `Options:\n` +
                `• Click OK to download the file (it will open in your default application)\n` +
                `• Click Cancel to keep the file linked without opening\n\n` +
                `Note: Web browsers cannot directly open files in native applications for security reasons. ` +
                `To open files directly, consider using a desktop version of this app.`
              );
              
              if (result) {
                // User chose to download/open
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = file.name;
                link.click();
                
                // Clean up the blob URL after a delay
                setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
              }
            }
          } else {
            window.alert('Permission denied. Cannot open the file. Please try selecting the file again.');
          }
        } catch (error) {
          console.error('Error accessing file with permission:', error);
          window.alert('Error accessing the file. Please try selecting the file again.');
        }
      }
      return;
    }
    
    // For other file paths, show information about the limitation
    window.alert(`File: ${fileName}\n\nNote: Web browsers cannot directly access your file system for security reasons.\n\nTo open files directly in their native applications, consider:\n• Using a desktop application version of this app\n• Converting the app to a Progressive Web App (PWA)\n• Using the File System Access API (requires HTTPS and user permission)`);
    
  } catch (error) {
    console.error('Error opening file:', error);
    window.alert(`File: ${fileName}\n\nError opening the file. Please try again.`);
  }
}

export function selectFilePath(): Promise<{ filePath: string; fileName: string; file: File }> {
  // This function opens a file picker dialog and returns file data
  return new Promise((resolve) => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        
        // Create a blob URL for the file so we can reference it
        const filePath = URL.createObjectURL(file);
        const fileName = file.name;
        
        resolve({ filePath, fileName, file });
      } else {
        resolve({ filePath: '', fileName: '', file: null as any });
      }
      // Clean up
      document.body.removeChild(fileInput);
    };
    
    // Add to DOM and trigger click
    document.body.appendChild(fileInput);
    fileInput.click();
  });
}

// Advanced file picker using File System Access API (modern browsers)
export async function selectFileWithPermission(): Promise<{ filePath: string; fileName: string; file: File; fileHandle?: any } | null> {
  // If we're in Electron, use native file picker
  if (isElectron()) {
    try {
      const result = await (window as any).electronAPI.selectFile();
      if (result) {
        return {
          filePath: result.filePath,
          fileName: result.fileName,
          file: null as any, // Not needed in Electron
          fileHandle: null
        };
      }
      return null;
    } catch (error) {
      console.error('Error selecting file in Electron:', error);
      return null;
    }
  }

  if (!isFileSystemAccessSupported()) {
    // Fallback to regular file picker
    return selectFilePath();
  }

  try {
    // Use the modern File System Access API with proper file type configuration
    const [fileHandle] = await (window as any).showOpenFilePicker({
      multiple: false,
      types: [
        {
          description: 'All Files',
          accept: {
            '*/*': []
          }
        }
      ]
    });

    if (fileHandle) {
      const file = await fileHandle.getFile();
      const fileName = file.name;
      
      // Create a special path to indicate we have file access
      const filePath = `file://${Date.now()}_${fileName}`;
      
      // Store the file handle for later access
      fileHandles.set(filePath, fileHandle);
      
      return {
        filePath,
        fileName,
        file,
        fileHandle
      };
    }
  } catch (error) {
    console.error('Error with File System Access API:', error);
    
    // Fallback to regular file picker without popup
    return selectFilePath();
  }

  return null;
}
