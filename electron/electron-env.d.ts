/// <reference types="vite-plugin-electron/electron-env" />

import { TvResponse } from './lib/teamviewer'

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

export { };
// Used in Renderer process, expose in `preload.ts`
declare global {
  interface Window {
    ipcRenderer: import('electron').IpcRenderer,
    api: {
      //db
      findByPhone: (opts: { phone: string }) => Promise<[]>,
      findByCompanyName: (opts: { company: string }) => Promise<[]>,
      findCompany: (opts: { query: string }) => Promise<[]>,
      getOpenTickets: () => Promise<[]>,
      findLastTicketsByCompany: (opts: { company: string }) => Promise<[]>

      //other
      getTeamviewerDevices: (opts?: { force: boolean }) => Promise<TvResponse>
    },
    app: {
      firstRun: () => Promise<boolean>,
      updateSettings: (opts: { user: string, pass: string }) => Promise<boolean>
    }
  }
}