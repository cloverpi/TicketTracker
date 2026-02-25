import { getAppDataSettings, RegistrySettings, saveAppDataSettings } from "./settings";
import { defaultSearch, searchMap } from "./tvPrefilledSearchDefaults";

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

let customSearch: searchMap = {}

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

export async function setPrefilledSearchDefault({ companyName = '', query = '' }) {
    if (companyName == '') return;
    if (!query || query == '') {
        delete customSearch[companyName];
    } else {
        customSearch[companyName] = query;
    }
    await saveAppDataSettings(customSearch);
}

export async function getPrefilledSearchDefault({ companyName = '' }) {
    if (companyName == '') return;
    if (customSearch[companyName]) return customSearch[companyName];
    return defaultSearch[companyName];
}

export async function getCustomSearchFromFile() {
    const appDataSettings = await getAppDataSettings();
    if (appDataSettings) {
        customSearch = appDataSettings;
    }
}