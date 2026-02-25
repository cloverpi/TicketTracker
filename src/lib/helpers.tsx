import Fuse from "fuse.js"
import { tvDevice } from "../../electron/lib/teamviewer"

// export function normalizeAlias(input: string): string {
//   let s = input.toUpperCase()

//   s = s.replace(/\./g, "")
//   s = s.replace(/^@/, "")
//   s = s.replace(/[()]/g, "")
//   s = s.replace(/\*.*?\*/g, " ")

//   s = s.replace(/\bB\/O\b/g, "BACK OFFICE")
//   s = s.replace(/\bBACKOFFICE\b/g, "BACK OFFICE")
//   s = s.replace(/\bBO\b/g, "BACK OFFICE")

//   s = s.replace(/\bRMSERVER\b/g, "SERVER")
//   s = s.replace(/\bRM SERVER\b/g, "SERVER")
//   s = s.replace(/\bSRVR\b/g, "SERVER")

//   s = s.replace(/\bCASH[-\s]?(\d+)\b/g, "CASH $1")
//   s = s.replace(/\b(\d+)(ST|ND|RD|TH)\b/g, "$1")
//   s = s.replace(/\b22N\b/g, "22")

//   s = s.replace(/\bST\b/g, "STREET")
//   s = s.replace(/\bAVE\b/g, "AVENUE")
//   s = s.replace(/\bRD\b/g, "ROAD")

//   s = s.replace(/\bWIN\s?\d+\b/g, " ")
//   s = s.replace(/\bWINDOWS\s?\d+\b/g, " ")

//   s = s.replace(/\bLAPTOP\b/g, " ")
//   s = s.replace(/\bTABLET\b/g, " ")
//   s = s.replace(/\bPC\b/g, " ")
//   s = s.replace(/\bMOBILE\b/g, " ")

//   s = s.replace(/\b20\d{2}\b/g, " ")

//   s = s.replace(/[^\w\s]/g, " ")
//   s = s.replace(/\s+/g, " ").trim()

//   return s
// }

// export function createDeviceSearch(devices: tvDevice[]) {
//   const prepared = devices.map(d => ({
//     ...d,
//     normalized: normalizeAlias(d.alias)
//   }))

//   const fuse = new Fuse(prepared, {
//     keys: ["normalized"],
//     includeScore: true,
//     threshold: 0.385,
//     ignoreLocation: true,
//     minMatchCharLength: 2
//   })

//   function search(query: string) {
//     const normalizedQuery = normalizeAlias(query)
//     if (!normalizedQuery) return []

//     const results = fuse.search(normalizedQuery)

//     return results
//       .map(r => ({
//           remotecontrol_id: r.item.remotecontrol_id,
//           device_id: r.item.device_id,
//           alias: r.item.alias,
//           groupid: r.item.groupid,
//           online_state: r.item.online_state,
//           assigned_to: r.item.assigned_to,
//           supported_features: r.item.supported_features,
//           teamviewer_id: r.item.teamviewer_id,
//       })).sort((a, b) => a.alias.localeCompare(b.alias))
//   }

//   return { search }
// }



function normalize(str: string) {
  return str.toLowerCase()
}

function matchPattern(text: string, pattern: string) {
  const t = normalize(text)
  const p = normalize(pattern)

  if (!p.includes("*")) {
    return t.includes(p)
  }

  if (p === "*") return true

  if (p.startsWith("*") && p.endsWith("*")) {
    const inner = p.slice(1, -1)
    return t.includes(inner)
  }

  if (p.startsWith("*")) {
    const inner = p.slice(1)
    return t.endsWith(inner)
  }

  if (p.endsWith("*")) {
    const inner = p.slice(0, -1)
    return t.startsWith(inner)
  }

  return false
}

function parseQuery(query: string) {
  return query
    .split("|")
    .map(orPart =>
      orPart
        .trim()
        .split("+")
        .map(t => t.trim())
        .filter(Boolean)
        .map(token => {
          const negated = token.startsWith("!")
          const pattern = negated ? token.slice(1).trim() : token
          return { negated, pattern }
        })
    )
}

export function match(text: string, query: string) {
  const orGroups = parseQuery(query)

  for (const group of orGroups) {
    let groupMatch = true

    for (const term of group) {
      const isMatch = matchPattern(text, term.pattern)

      if (term.negated) {
        if (isMatch) {
          groupMatch = false
          break
        }
      } else {
        if (!isMatch) {
          groupMatch = false
          break
        }
      }
    }

    if (groupMatch) return true
  }

  return false
}

export function findMatches(list: tvDevice[], query: string) {
  if (query == '') return [];
  const filteredList = list.filter((l)=>match(l.alias, query)).sort((a,b)=> a.alias.localeCompare(b.alias));

  return filteredList
}