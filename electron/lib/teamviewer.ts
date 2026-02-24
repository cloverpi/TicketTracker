import { RegistrySettings } from "./settings";

export type device = {
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
    devices: device[];
}

const timeout = 120000; // 2 minutes.
let lastUpdate = Date.now();
let tv: TvResponse | undefined = undefined;

const connectionSettings = {
    url: 'https://webapi.teamviewer.com/api/v1/devices',
    token: ''
}

export function teamviewerConnectionProperties(settings: RegistrySettings) {
    connectionSettings.token = settings.token;
}

export async function getTeamviewerDevices(force = false) {
    const { token, url } = connectionSettings;
    if (!token) return;
    try {
        if (!tv || force || Date.now() - lastUpdate >= timeout) {
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            const data: TvResponse = await res.json();
            tv = data;
            lastUpdate = Date.now();
            return data;
        } else {
            return tv;
        }
    } catch (e) {
        console.log(e);
        return;
    }

}