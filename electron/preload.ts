import { ipcRenderer, contextBridge } from 'electron'

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
  findByCompanyName: (opts: { company: string }) => {
    return ipcRenderer.invoke("findByCompanyName", opts);
  },
  findCompany: (opts: { query: string }) => {
    return ipcRenderer.invoke("findCompany", opts);
  },
  getOpenTickets: () => {
    return ipcRenderer.invoke("getOpenTickets");
  },
  findLastTicketsByCompany: (opts: { company: string }) => {
    return ipcRenderer.invoke("findLastTicketsByCompany", opts);
  },

  //other
  getTeamviewerDevices: (opts?: { force: boolean }) => {
    return ipcRenderer.invoke("getTeamviewerDevices", opts);
  },


});

contextBridge.exposeInMainWorld('app', {
  //
  firstRun: () => {
    return ipcRenderer.invoke("firstRun");
  },
  updateSettings: (opts: { user: string, pass: string, displayName: string, teamviewerLocation: string }) => {
    return ipcRenderer.invoke("updateSettings", opts);
  },
  getCachedSettings: () => {
    return ipcRenderer.invoke("getCachedSettings");
  },
  selectTeamviewer: () => {
    return ipcRenderer.invoke("selectTeamviewer");
  },
  getPrefilledSearchDefault: (opts: { companyName: string }) => {
    return ipcRenderer.invoke("getPrefilledSearchDefault", opts);
  },
  setPrefilledSearchDefault: (opts: { companyName: string, query: string }) => {
    return ipcRenderer.invoke("setPrefilledSearchDefault", opts);
  },
});