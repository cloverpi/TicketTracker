import { app, BrowserWindow, Menu } from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import odbc, { Connection } from "odbc";

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

function createWindow() {
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

app.whenReady().then(createWindow)


let conn: Connection | undefined = undefined;

async function connect() {
  conn = await odbc.connect("DSN=ChaseTrack");
}

async function sendQuery(q: string) {

  if (!!conn) {
    return await conn!.query(q);
  } else {
    await connect();
    return await conn!.query(q);
  }

}

// async function run() {
//   try {

//     const rows = await sendQuery(`
//       SELECT
//         s.ticket,
//         s.company,
//         s.issue,
//         s.solution,
//         c.Phone,
//         c.contact
//       FROM ServTrack s
//       LEFT JOIN cust c
//         ON s.company = c.companyName
//     `);

//     // console.log(rows);
//   } catch (e) {
//     console.log(e);
//   }
// }

// async function justTickets() {
//   try {

//     const rows = await sendQuery(`
//       SELECT
//         s.ticket,
//         s.company,
//         s.issue,
//         s.solution
//       FROM ServTrack s
//       LEFT JOIN cust c
//         ON s.company = c.companyName
//       ORDER BY s.ticket DESC
//       LIMIT 5
//       OFFSET 5;
//     `);

//     console.log([...rows]);
//   } catch (e) {
//     console.log(e);
//   }
// }

// async function insertMoreTickets() {
//   const companies = ["Acme Corp", "Globex", "Initech"];
//   const issues = [
//     "Cannot print",
//     "PC won't boot",
//     "Email not sending",
//     "VPN not connecting",
//     "Internet slow",
//     "Keyboard not working",
//     "Monitor flickering",
//     "Software crash",
//     "File server unreachable",
//     "Password expired"
//   ];

//   const solutions = [
//     "Reinstalled printer driver and cleared queue",
//     "Replaced faulty power supply",
//     "Reconfigured SMTP settings",
//     "Reset VPN profile and credentials",
//     "Restarted router and cleared DNS cache",
//     "Replaced keyboard",
//     "Adjusted refresh rate and reseated cable",
//     "Updated application to latest version",
//     "Restarted file server service",
//     "Reset user password"
//   ];

//   let ticketNumber = 5;

//   for (let i = 0; i < 24; i++) {
//     const company = companies[i % companies.length];
//     const issue = issues[i % issues.length];
//     const solution = solutions[i % solutions.length];

//     const ticket = ticketNumber.toString().padStart(3, "0").padStart(7, " ");
//     ticketNumber++;

//     const sql = `
//       INSERT INTO ServTrack (ticket, company, issue, solution)
//       VALUES (
//         '${ticket}',
//         '${company}',
//         '${issue}',
//         '${solution}'
//       )
//     `;
//     try {
//       const result = await sendQuery(sql);
//       console.log(result);
//     } catch (e) {
//       console.log(e);
//     }
//   }
// }

async function findByPhone(phone: string) {
  if (!/\d/.test(phone)) return [];
  const digits = phone.replace(/\D/g, "");

  const phoneQuery = `%${digits.slice(0, 3)}%${digits.slice(3, 6)}%${digits.slice(6)}%`;

  const rows = await sendQuery(`
    SELECT *
    FROM cust
    WHERE Phone LIKE '${phoneQuery}'
    LIMIT 5
  `);

  console.log([...rows]);
}


connect();
// insertMoreTickets();
// run();
// justTickets();
findByPhone('306.7');
