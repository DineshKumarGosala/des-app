const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App information
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Dialog functions
  showSaveDialog: () => ipcRenderer.invoke('show-save-dialog'),
  showErrorDialog: (title, content) => ipcRenderer.invoke('show-error-dialog', title, content),
  showInfoDialog: (title, message) => ipcRenderer.invoke('show-info-dialog', title, message),
  
  // Navigation
  onNavigateToHome: (callback) => ipcRenderer.on('navigate-to-home', callback),
  
  // Platform detection
  platform: process.platform,
  
  // Window controls (for custom title bar if needed)
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  
  // File operations
  writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  
  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
});

// Prevent the page from navigating away
window.addEventListener('beforeunload', (event) => {
  // Prevent default navigation
  event.preventDefault();
  // Return empty string (required for some browsers)
  return '';
});
