// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

export type Authorized = (event: Electron.IpcRendererEvent) => void;

contextBridge.exposeInMainWorld('api', {
    // Working with storage
    getData: (key: string) => ipcRenderer.invoke('store:get', key),

    // Working with oauth2
    authorize: () => ipcRenderer.invoke('oauth:authorize'),
    onAuthorized: (callback: Authorized) => ipcRenderer.on('event:authorized', callback),
    removeAuthorizedListener: (callback: Authorized) => ipcRenderer.removeListener('event:authorized', callback),

    // Doing some network requests
    getCurrentUser: () => ipcRenderer.invoke('oauth:getCurrentUser'),
});
