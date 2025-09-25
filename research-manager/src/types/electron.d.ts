interface ElectronAPI {
  // File operations
  selectFile: () => Promise<string | null>;
  selectFolder: () => Promise<{ folderPath: string; folderName: string } | null>;
  openFile: (filePath: string) => Promise<boolean>;
  validateFile: (filePath: string) => Promise<boolean>;
  getFileInfo: (filePath: string) => Promise<{ exists: boolean; size: number; modified: Date } | null>;
  
  // Data persistence
  loadData: () => Promise<any>;
  saveData: (data: any) => Promise<boolean>;
  
  // Platform info
  platform: string;
  isElectron: boolean;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
