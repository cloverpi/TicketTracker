/// <reference types="vite-plugin-electron/electron-env" />

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


// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer,
  api: {
    //db
    findByPhone: (opts: { phone: string }) => Promise<[]>,
    findByCompanyName: (opts: { company: string }) => Promise<[]>,
    findCompany: (opts: { query: string }) => Promise<[]>,
    getOpenTickets: () => Promise<[]>,
    findLastTicketsByCompany: (opts: { company: string }) => Promise<[]>,

    //other
    getTeamviewerDevices: (opts?: { force: boolean }) => Promise<[]>
  },
  app: {
    firstRun: () => Promise<boolean>,
    updateSettings: (opts: { user: string, pass: string, displayName: string, teamviewerLocation: string }) => Promise<boolean>,
    getCachedSettings: () => Promise<Record<'displayName' | 'teamviewerLocation', string>>,
    selectTeamviewer: () => Promise<string | undefined>,
    getPrefilledSearchDefault: (opts: { companyName: string }) => Promise<string>,
    setPrefilledSearchDefault: (opts: { companyName: string, query: string }) => void,
    setTvPassword: (opts: { id: number, pass: string }) => void,
    launchTeamviewer: (opts: { id: number }) => void
    // getTvPassword: (opts: {id: number}) => Promise<string>   // <--- might not need
  }
}
