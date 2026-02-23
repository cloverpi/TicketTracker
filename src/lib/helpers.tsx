import Fuse from "fuse.js"

type TvDevice = {
  remotecontrol_id: string
  device_id: string
  alias: string
  groupid: string
  online_state: string
  assigned_to: boolean
  supported_features?: string
  teamviewer_id: number
}

export function normalizeAlias(input: string): string {
  let s = input.toUpperCase()

  s = s.replace(/\./g, "")
  s = s.replace(/^@/, "")
  s = s.replace(/[()]/g, "")
  s = s.replace(/\*.*?\*/g, " ")

  s = s.replace(/\bB\/O\b/g, "BACK OFFICE")
  s = s.replace(/\bBACKOFFICE\b/g, "BACK OFFICE")
  s = s.replace(/\bBO\b/g, "BACK OFFICE")

  s = s.replace(/\bRMSERVER\b/g, "SERVER")
  s = s.replace(/\bRM SERVER\b/g, "SERVER")
  s = s.replace(/\bSRVR\b/g, "SERVER")

  s = s.replace(/\bCASH[-\s]?(\d+)\b/g, "CASH $1")
  s = s.replace(/\b(\d+)(ST|ND|RD|TH)\b/g, "$1")
  s = s.replace(/\b22N\b/g, "22")

  s = s.replace(/\bST\b/g, "STREET")
  s = s.replace(/\bAVE\b/g, "AVENUE")
  s = s.replace(/\bRD\b/g, "ROAD")

  s = s.replace(/\bWIN\s?\d+\b/g, " ")
  s = s.replace(/\bWINDOWS\s?\d+\b/g, " ")

  s = s.replace(/\bLAPTOP\b/g, " ")
  s = s.replace(/\bTABLET\b/g, " ")
  s = s.replace(/\bPC\b/g, " ")
  s = s.replace(/\bMOBILE\b/g, " ")

  s = s.replace(/\b20\d{2}\b/g, " ")

  s = s.replace(/[^\w\s]/g, " ")
  s = s.replace(/\s+/g, " ").trim()

  return s
}

// type TvDevice = {
//   remotecontrol_id: string
//   device_id: string
//   alias: string
//   groupid: string
//   online_state: string
//   assigned_to: boolean
//   supported_features?: string
//   teamviewer_id: number
// }

export function createDeviceSearch(devices: TvDevice[]) {
  const prepared = devices.map(d => ({
    ...d,
    normalized: normalizeAlias(d.alias)
  }))

  const fuse = new Fuse(prepared, {
    keys: ["normalized"],
    includeScore: true,
    threshold: 0.385,
    ignoreLocation: true,
    minMatchCharLength: 2
  })

  function search(query: string) {
    const normalizedQuery = normalizeAlias(query)
    if (!normalizedQuery) return []

    const results = fuse.search(normalizedQuery)

    return results
      .map(r => ({
          score: 1 - (r.score ?? 0),
          remotecontrol_id: r.item.remotecontrol_id,
          device_id: r.item.device_id,
          alias: r.item.alias,
          groupid: r.item.groupid,
          online_state: r.item.online_state,
          assigned_to: r.item.assigned_to,
          supported_features: r.item.supported_features,
          teamviewer_id: r.item.teamviewer_id,
      })).sort((a, b) => a.alias.localeCompare(b.alias))
  }

  return { search }
}
// export function createDeviceSearch(devices: TvDevice[]) {
//   const tokenIndex = new Map<string, Set<string>>()
//   const normalizedById = new Map<string, string>()
//   const deviceById = new Map<string, TvDevice>()

//   for (const d of devices) {
//     deviceById.set(d.device_id, d)

//     const normalized = normalizeAlias(d.alias)
//     normalizedById.set(d.device_id, normalized)

//     const tokens = normalized.split(" ").filter(t => t.length > 1)

//     for (const token of tokens) {
//       if (!tokenIndex.has(token)) tokenIndex.set(token, new Set())
//       tokenIndex.get(token)!.add(d.device_id)
//     }
//   }

//   function weightToken(token: string): number {
//     if (/^\d+$/.test(token)) return 6
//     if (token.length >= 5) return 3
//     return 1
//   }

//   function search(query: string, threshold = 0.45) {
//     const normalizedQuery = normalizeAlias(query)
//     if (!normalizedQuery) return []

//     const queryTokens = normalizedQuery
//       .split(" ")
//       .filter(t => t.length > 1)

//     if (queryTokens.length === 0) return []

//     // --- Intersection-based narrowing ---

//     const firstToken = queryTokens[0]
// const firstMatches = tokenIndex.get(firstToken)

// if (!firstMatches) return []

// let candidateSet = new Set(firstMatches)

// for (let i = 1; i < queryTokens.length; i++) {
//   const token = queryTokens[i]
//   const matches = tokenIndex.get(token)
//   if (!matches) continue

//   const isStrong =
//     /^\d+$/.test(token) || token.length >= 5

//   if (isStrong) {
//     candidateSet = new Set(
//       [...candidateSet].filter(id => matches.has(id))
//     )
//   }
// }

// if (candidateSet.size === 0) return []

//     // if (!candidateSet || candidateSet.size === 0) return []

//     // --- Weighted ratio scoring ---

//     const results: { device: TvDevice; score: number }[] = []

//     for (const device_id of candidateSet) {
//       const alias = normalizedById.get(device_id)!
//       const aliasTokens = alias.split(" ")
//       const aliasSet = new Set(aliasTokens)

//       let totalWeight = 0
//       let matchedWeight = 0

//       for (const qt of queryTokens) {
//         const w = weightToken(qt)
//         totalWeight += w

//         if (aliasSet.has(qt)) {
//           matchedWeight += w
//         }
//       }

//       const score = matchedWeight / totalWeight

//       if (score >= threshold) {
//         results.push({
//           device: deviceById.get(device_id)!,
//           score
//         })
//       }
//     }

//     results.sort((a, b) => b.score - a.score)

//     return results
//   }

//   return { search }
// }