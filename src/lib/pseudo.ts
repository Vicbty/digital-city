export const PSEUDO_MIN = 2
export const PSEUDO_MAX = 16
const LS_PSEUDO = 'dc_pseudo'

export function cleanPseudo(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim().slice(0, PSEUDO_MAX)
}

export function loadPseudo(): string {
  try {
    return localStorage.getItem(LS_PSEUDO) ?? ''
  } catch {
    return ''
  }
}

export function storePseudo(pseudo: string) {
  try {
    localStorage.setItem(LS_PSEUDO, pseudo)
  } catch {
    /* stockage indisponible : on ignore */
  }
}
