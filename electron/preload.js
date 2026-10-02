const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getExports: () => ipcRenderer.invoke('get-exports'),
  readExport: (filePath) => ipcRenderer.invoke('read-export', filePath)
});
