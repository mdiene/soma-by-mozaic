import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Tuile d'indicateur : libellé, valeur, contexte, barre de progression optionnelle. */
export function Stat({
  libelle,
  valeur,
  contexte,
  progression,
  accent = 'nuit',
}: {
  libelle: string
  valeur: ReactNode
  contexte?: ReactNode
  progression?: number | null
  accent?: 'nuit' | 'orange' | 'or' | 'vert'
}) {
  const barre = { nuit: 'bg-nuit-700', orange: 'bg-soma-orange', or: 'bg-soma-or', vert: 'bg-soma-vert' }[accent]
  return (
    <div className="rounded-xl border border-bordure bg-surface p-4">
      <p className="text-xs font-medium tracking-wide text-texte-doux uppercase">{libelle}</p>
      <p className="mt-2 text-2xl font-semibold text-texte">{valeur}</p>
      {contexte && <p className="mt-1 text-sm text-texte-doux">{contexte}</p>}
      {progression !== undefined && progression !== null && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-nuit-100" role="progressbar" aria-valuenow={Math.round(progression)} aria-valuemin={0} aria-valuemax={100}>
          <div className={cn('h-full rounded-full', barre)} style={{ width: `${Math.min(100, Math.max(0, progression))}%` }} />
        </div>
      )}
    </div>
  )
}
