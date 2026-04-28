const { contextBridge, ipcRenderer } = require('electron');

// Exponha APIs seguras para o frontend aqui se necessário
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
});
