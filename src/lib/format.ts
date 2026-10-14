const nombre = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 })
const tonnage = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
const pourcent = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 })
const dateCourte = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })

type Valeur = number | string | null | undefined

function versNombre(v: Valeur): number | null {
  if (v === null || v === undefined || v === '') return null
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : null
}

/** 1250000 -> « 1 250 000 FCFA » */
export function fcfa(v: Valeur): string {
  const n = versNombre(v)
  return n === null ? '—' : `${nombre.format(n)} FCFA`
}

/** 1234.5 -> « 1 234,5 t » */
export function tonnes(v: Valeur): string {
  const n = versNombre(v)
  return n === null ? '—' : `${tonnage.format(n)} t`
}

export function entier(v: Valeur): string {
  const n = versNombre(v)
  return n === null ? '—' : nombre.format(n)
}

export function pct(v: Valeur): string {
  const n = versNombre(v)
  return n === null ? '—' : `${pourcent.format(n)} %`
}

/** '2026-10-14' ou ISO complet -> « 14/10/2026 » */
export function date(v: string | null | undefined): string {
  if (!v) return '—'
  const d = new Date(v.length === 10 ? `${v}T00:00:00` : v)
  return Number.isNaN(d.getTime()) ? '—' : dateCourte.format(d)
}

/** Taux de réalisation borné, en %, ou null si la cible est nulle. */
export function tauxRealisation(realise: Valeur, cible: Valeur): number | null {
  const r = versNombre(realise)
  const c = versNombre(cible)
  if (r === null || c === null || c <= 0) return null
  return (r / c) * 100
}
