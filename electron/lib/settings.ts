import { app } from "electron";
import WinReg from "winreg";

const appName = app.getName();
const secretBuf = Buffer.from('EmberIsBisemberisbisemberisbisemberisbis', 'utf-8');

export interface RegistrySettings {
    user: string;
    pass: string;
}

const programKey = new WinReg({
    hive: WinReg.HKCU,
    key: `\\Software\\${appName}`
});

function XORStrings(buf: Buffer) {
    for (let i = 0; i < buf.length; i++) {
        buf[i] ^= secretBuf[i];
    }
    return buf.toString('base64');
}

function decodeString(b64String: string) {
    const buf = Buffer.from(b64String, 'base64');
    const realValueBuf = Buffer.from(XORStrings(buf), 'base64');
    return realValueBuf.toString('utf-8');
}

function encodeString(str: string) {
    return XORStrings(Buffer.from(str, 'utf-8'));
}

// export function saveSettings() {
//     programKey.set('pass', WinReg.REG_SZ, encodeString('somepass'), (err) => {
//         if (err) {
//             console.log('some error occurred');
//             console.log(err);
//             return;
//         }
//         console.log('set');
//     })
// }

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

    return settings;
}

export async function setSettings(user: string, pass: string) {
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
        };
    });
}