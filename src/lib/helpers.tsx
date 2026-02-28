import { tvDevice } from "../../electron/lib/teamviewer"

export function titleCase(s: string | undefined) {
  if (!s) return '';
  return s.toLowerCase().replace(/\b[\p{L}\p{N}]/gu, (c) => c.toUpperCase());
}

export function getDateString(date: Date | undefined): string | undefined {
  if (!date) return;
  return date.toLocaleDateString('en-CA', { timeZone: 'UTC' })
}

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