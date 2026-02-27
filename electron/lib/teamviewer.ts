import { decodeString, encodeString, getAppDataSettings, getCachedSettings, RegistrySettings, saveAppDataSettings } from "./settings";
import { defaultSearch, SearchMap } from "./tvPrefilledSearchDefaults";
import { spawn } from "child_process";

export type tvDevice = {
    remotecontrol_id: string,
    device_id: string,
    alias: string,
    description?: string,
    groupid: string,
    online_state: string,
    assigned_to: boolean,
    supported_features: string,
    teamviewer_id: number,
}

export type TvResponse = {
    devices: tvDevice[];
}

export type AppData = {
    customSearch: SearchMap,
    tp: Record<string, string>
}

const appData: AppData = {
    customSearch: {},
    tp: {},
}

const timeout = 180000; // 3 minutes.
let lastUpdate = Date.now();
let tv: tvDevice[] | undefined = undefined;

const connectionSettings = {
    url: 'https://webapi.teamviewer.com/api/v1/devices',
    token: ''
}

export function teamviewerConnectionProperties(settings: RegistrySettings) {
    connectionSettings.token = settings.token;
}

export async function getTeamviewerDevices({ force = false }) {
    const { token, url } = connectionSettings;
    if (!token) return;
    try {
        if (!tv || force || Date.now() - lastUpdate >= timeout) {
            lastUpdate = Date.now();
            console.log('fetching new');
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const data: TvResponse = await res.json();
            const { devices } = data;
            tv = devices;

            return devices;
        } else {
            return tv;
        }
    } catch (e) {
        console.log(e);
        return;
    }
}

export async function saveAppData() {
    const tp = { ...appData.tp };
    Object.keys(tp).forEach((k) => tp[k] = encodeString(tp[k]));

    await saveAppDataSettings({ customSearch: appData.customSearch, tp: tp });
}

export async function getTvPassword({ id = 0 }) {
    if (id == 0) return;
    return appData.tp[id.toString()];
}

export async function setTvPassword({ id = 0, pass = '' }) {
    if (id == 0) return;
    if (pass == '') {
        delete appData.tp[id.toString()];
    } else {
        appData.tp[id.toString()] = pass;
    }
    await saveAppData();
}

export async function setPrefilledSearchDefault({ companyName = '', query = '' }) {
    if (companyName == '') return;
    if (!query || query == '') {
        delete appData.customSearch[companyName];
    } else {
        appData.customSearch[companyName] = query;
    }
    await saveAppData();
}

export async function getPrefilledSearchDefault({ companyName = '' }) {
    if (companyName == '') return;
    if (appData.customSearch[companyName]) return appData.customSearch[companyName];
    return defaultSearch[companyName];
}

export async function getCustomSearchFromFile() {
    const appDataSettings: AppData = await getAppDataSettings();
    if (!appDataSettings) return
    const tp = { ...appDataSettings.tp }
    Object.keys(tp).forEach((k) => tp[k] = decodeString(tp[k]));
    appData.customSearch = appDataSettings.customSearch;
    appData.tp = tp;
}

export function launchTeamviewer({ id = 0 }) {
    if (id == 0) return;

    const { teamviewerLocation, teamviewerPass } = getCachedSettings();
    if (!teamviewerLocation) return;
    const pass = appData.tp[id.toString()] ?? teamviewerPass ?? '';
    spawn(
        teamviewerLocation,
        ['-i', id.toString(), '--Password', pass]
    );
}