import { app, BrowserWindow, dialog, ipcMain, Menu, Tray } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { connect, dbConnectionProperties, findByCompanyName, findByPhone, findCompany, findLastTicketsByCompany, getOpenTickets, testConnection, updateCompanyTicket } from './lib/db'
import { getCachedSettings, getSettings, setSettings } from './lib/settings'
import { getCustomSearchFromFile, getPrefilledSearchDefault, getTeamviewerDevices, setPrefilledSearchDefault, setTvPassword, teamviewerConnectionProperties, launchTeamviewer } from './lib/teamviewer'
import { screen } from "electron"


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
let tray: Tray | null = null

let closeButtonWin: BrowserWindow | null;
const WINDOW_WIDTH = 600;
let width = 1920;
let height = 1080;
let sliding = false;


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
      teamviewerConnectionProperties(settings);
      await getTeamviewerDevices({ force: true });
      await getCustomSearchFromFile();
    }
  } catch (e) {
    firstRun = true;
    console.log(e);
  }

  Menu.setApplicationMenu(null);
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
    height: 1080,
    width: 600,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  closeButtonWin = new BrowserWindow({
    width: 24,
    height: 80,
    frame: false,
    resizable: false,
    // transparent: true,
    show: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs')
    }
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    closeButtonWin.loadURL(`${process.env.VITE_DEV_SERVER_URL}/closeButton.html`);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
    closeButtonWin.loadFile(path.join(RENDERER_DIST, 'closeButton.html'));
  }

  win.webContents.openDevTools({ mode: 'detach' });
  closeButtonWin.webContents.openDevTools({ mode: 'detach' })

  const windowScreen = screen.getPrimaryDisplay().workAreaSize
  width = windowScreen.width;
  height = windowScreen.height;

  win.setBounds({
    x: width,
    y: 0,
    width: WINDOW_WIDTH,
    height
  });

  setInterval(() => {
    const point = screen.getCursorScreenPoint()
    const { width } =
      screen.getPrimaryDisplay().workAreaSize

    if (point.x >= width - 2 &&
      point.y <= height * 0.8 &&
      point.y >= height * 0.2 &&
      !sliding) {
      showSidebar();
    }
  }, 50)
}

function positionHandle() {
  if (win == undefined || closeButtonWin == undefined) return;

  const b = win.getBounds();

  closeButtonWin.setPosition(
    b.x - 24,
    b.y + 200
  )
}

function slideTo(targetX: number) {
  if (win == undefined || win == null) return;
  const bounds = win.getBounds();

  let timeout: ReturnType<typeof setTimeout> | undefined = undefined


  const step = () => {
    timeout = undefined;
    if (win == undefined || win == null) return;
    const current = win.getBounds().x


    if (Math.abs(current - targetX) < 10) {
      // console.log(current + (targetX - current) * 0.10);
      win.setPosition(targetX, bounds.y)
      positionHandle();
      sliding = false;
      return
    }

    const next =
      current + (targetX - current) * 0.10

    win.setPosition(Math.round(next), bounds.y)
    positionHandle();

    if (timeout == undefined) timeout = setTimeout(step, 20);
  }

  step()
}

function showSidebar() {
  if (win == undefined) return;
  if (sliding) return;
  sliding = true;
  win.show()
  closeButtonWin?.show()
  slideTo(width - WINDOW_WIDTH)
}

function hideSidebar() {
  if (sliding) return;
  sliding = true;
  slideTo(width);
  closeButtonWin?.hide();

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

app.whenReady().then(() => {
  tray = new Tray(
    path.join(process.env.VITE_PUBLIC, "icon.png")
  )

  const contextMenu = Menu.buildFromTemplate([
    { label: "Show", click: () => showSidebar() },
    { label: "Hide", click: () => hideSidebar() },
    { type: "separator" },
    { label: "Quit", click: () => app.quit() }
  ])

  tray.setToolTip("TicketTracker")
  tray.setContextMenu(contextMenu)

  tray.on("click", () => {
    showSidebar()
  })
})

ipcMain.handle("firstRun", () => {
  return firstRun;
});

ipcMain.handle("getCachedSettings", async (_event, _) => {
  return getCachedSettings();
});

ipcMain.handle("updateSettings", async (_event, opts) => {
  const { user, pass, displayName, teamviewerLocation } = opts;
  const connectionStatus = await testConnection(user, pass);
  console.log(`connection: ${connectionStatus}`);
  if (!connectionStatus) return false;
  setSettings(user, pass, displayName, teamviewerLocation);
  firstRun = false;

  const settings = await getSettings();
  if (settings && settings.token) {
    teamviewerConnectionProperties(settings);
    await getTeamviewerDevices({ force: true });
    await getCustomSearchFromFile();
  }
  return true;
});

ipcMain.handle("selectTeamviewer", async (_event, _opts) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Application", extensions: ["exe"] }]
  });
  if (canceled) return;
  return filePaths[0];
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

ipcMain.handle("updateCompanyTicket", async (_event, opts) => {
  return await updateCompanyTicket(opts.oldCompany, opts.newCompany);
});

ipcMain.handle("getTeamviewerDevices", async (_event, opts) => {
  return await getTeamviewerDevices(opts);
});

ipcMain.handle("getPrefilledSearchDefault", async (_event, opts) => {
  return await getPrefilledSearchDefault(opts);
});

ipcMain.handle("setPrefilledSearchDefault", async (_event, opts) => {
  return await setPrefilledSearchDefault(opts);
});

ipcMain.handle("setTvPassword", async (_event, opts) => {
  return await setTvPassword(opts);
});

ipcMain.handle("launchTeamviewer", async (_event, opts) => {
  return await launchTeamviewer(opts);
});


ipcMain.on("sidebar-close", () => {
  hideSidebar()
})