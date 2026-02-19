import { ipcRenderer, contextBridge } from 'electron'
import { getOpenTickets } from './lib/db'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
})

contextBridge.exposeInMainWorld('api', {
  //db
  findByPhone: (opts: { phone: string }) => {
    return ipcRenderer.invoke("findByPhone", opts);
  },
  getOpenTickets: () => {
    return ipcRenderer.invoke("getOpenTickets");
  },
  findLastTicketsByCompany: (opts: { company: string }) => {
    return ipcRenderer.invoke("findLastTicketsByCompany", opts);
  },

});

contextBridge.exposeInMainWorld('app', {
  //
  firstRun: () => {
    return ipcRenderer.invoke("firstRun");
  },
  updateSettings: (opts: { user: string, pass: string }) => {
    return ipcRenderer.invoke("updateSettings", opts);
  },

});