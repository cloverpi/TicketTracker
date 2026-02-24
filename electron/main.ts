import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { connect, dbConnectionProperties, findByCompanyName, findByPhone, findCompany, findLastTicketsByCompany, getOpenTickets, testConnection } from './lib/db'
import { getSettings, setSettings } from './lib/settings'
import { getTeamviewerDevices, teamviewerConnectionProperties } from './lib/teamviewer'



// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let firstRun: boolean = false;

async function createWindow() {
  try {
    const settings = await getSettings();
    if (settings && settings.user && settings.pass) {
      dbConnectionProperties(settings);
      await connect();
    } else {
      firstRun = true;
    }
    if (settings && settings.token) {
      teamviewerConnectionProperties(settings)
      // const tv = await getTeamviewerDevices();
    }
  } catch (e) {
    firstRun = true;
    console.log(e);
  }

  Menu.setApplicationMenu(null);
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'lifering.svg'),
    height: 1080,
    width: 600,
    // frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  win.webContents.openDevTools({ mode: 'detach' });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow);

ipcMain.handle("firstRun", () => {
  return firstRun;
});

ipcMain.handle("updateSettings", async (_event, opts) => {
  const { user, pass } = opts;
  const connectionStatus = await testConnection(user, pass);
  if (!connectionStatus) return false;
  setSettings(user, pass);
  firstRun = false;
  return true;
});

ipcMain.handle("findByPhone", async (_event, opts) => {
  return await findByPhone(opts.phone);
});

ipcMain.handle("findByCompanyName", async (_event, opts) => {
  return await findByCompanyName(opts.company);
});

ipcMain.handle("findCompany", async (_event, opts) => {
  return await findCompany(opts.query);
});

ipcMain.handle("findLastTicketsByCompany", async (_event, opts) => {
  return await findLastTicketsByCompany(opts.company);
});

ipcMain.handle("getOpenTickets", async () => {
  return await getOpenTickets();
});


