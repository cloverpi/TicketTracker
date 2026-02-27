import { app } from "electron";
import fs from 'fs/promises';
import path from "path";
import WinReg from "winreg";
import { AppData } from "./teamviewer";

const appName = app.getName();
const secretBuf = Buffer.from('EmberIsBisemberisbisemberisbisemberisbisEmberIsBisemberisbisemberisbisemberisbisEmberIsBisemberisbisemberisbisemberisbisEmberIsBisemberisbisemberisbisemberisbisEmberIsBisemberisbisemberisbisemberisbisEmberIsBisemberisbisemberisbisemberisbisEmberIsBisemberisbisemberisbisemberisbis', 'utf-8');

export interface RegistrySettings {
    user: string,
    pass: string,
    token: string,
    displayName: string,
    teamviewerLocation: string,
    teamviewerPass: string,
}

const programKey = new WinReg({
    hive: WinReg.HKCU,
    key: `\\Software\\${appName}`
});

const outputSettings = {
    displayName: '',
    teamviewerLocation: '',
    teamviewerPass: '',
}

const fileSettings = {
    location: path.join(app.getPath("userData"), "settings.json")
}
let writeQueue = Promise.resolve();

function XORStrings(buf: Buffer) {
    for (let i = 0; i < buf.length; i++) {
        buf[i] ^= secretBuf[i];
    }
    return buf.toString('base64');
}

export function decodeString(b64String: string) {
    const buf = Buffer.from(b64String, 'base64');
    const realValueBuf = Buffer.from(XORStrings(buf), 'base64');
    return realValueBuf.toString('utf-8');
}

export function encodeString(str: string) {
    return XORStrings(Buffer.from(str, 'utf-8'));
}

export async function getSettings() {
    const settings: RegistrySettings = await new Promise((resolve, reject) => {
        programKey.values((err, items) => {
            if (err) {
                reject(new Error("Error reading registry:"));
                return;
            }
            const realkey = {} as RegistrySettings;
            items.forEach((i) => { realkey[i.name as keyof RegistrySettings] = i.value });
            resolve(realkey);
        });
    });

    if (!settings.pass) return;

    settings.pass = decodeString(settings.pass);
    settings.token = decodeString(settings.token);
    settings.teamviewerPass = decodeString(settings.teamviewerPass);

    outputSettings.displayName = settings.displayName;
    outputSettings.teamviewerLocation = settings.teamviewerLocation;
    outputSettings.teamviewerPass = settings.teamviewerPass;

    return settings;
}

export async function setSettings(user: string, pass: string, displayName: string, teamviewerLocation: string) {
    programKey.set('user', WinReg.REG_SZ, user, (err) => {
        if (err) {
            console.log('Error creating user');
            console.log(err)
        }
    });
    programKey.set('pass', WinReg.REG_SZ, encodeString(pass), (err) => {
        if (err) {
            console.log('Error creating pass');
            console.log(err)
        }
    });
    programKey.set('displayName', WinReg.REG_SZ, displayName, (err) => {
        if (err) {
            console.log('Error creating displayName');
            console.log(err)
        }
    });
    programKey.set('teamviewerLocation', WinReg.REG_SZ, `"${teamviewerLocation}"`, (err) => {
        if (err) {
            console.log('Error creating teamviewer location');
            console.log(err)
        }
    });
    outputSettings.displayName = displayName;
    outputSettings.teamviewerLocation = teamviewerLocation;
}

export async function saveAppDataSettings(data: AppData) {
    try {
        if (!data) return;

        writeQueue = writeQueue.then(async () => {
            const dir = path.dirname(fileSettings.location)
            await fs.mkdir(dir, { recursive: true })
            console.log('saving.');
            return fs.writeFile(fileSettings.location, JSON.stringify(data, null, 2), "utf8");
        }).catch(err => {
            console.error(err);
        });

        return writeQueue;
    } catch (e) {
        console.log(e);
    }
}

export async function getAppDataSettings() {
    try {
        const jsonText = await fs.readFile(fileSettings.location, 'utf8')
        const appdata = JSON.parse(jsonText);

        return appdata;
    } catch (e) {
        console.log(e);
        return;
    }
}

export function getCachedSettings() {
    return outputSettings;
}