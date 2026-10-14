import { AlertTriangle, Inbox, Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'

export function Chargement({ texte = 'Chargement…' }: { texte?: string }) {
  return (
    <div className="flex items-center gap-2 p-6 text-sm text-texte-doux" role="status">
      <Loader2 className="size-4 animate-spin" aria-hidden /> {texte}
    </div>
  )
}

export function Erreur({ erreur }: { erreur: unknown }) {
  const message = erreur instanceof Error ? erreur.message : String(erreur)
  return (
    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>
        <p className="font-medium">Impossible de charger les données.</p>
        <p className="mt-0.5 text-red-700">{message}</p>
      </div>
    </div>
  )
}

export function Vide({ titre, children }: { titre: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
      <Inbox className="size-8 text-nuit-300" aria-hidden />
      <p className="font-medium text-texte">{titre}</p>
      {children && <div className="max-w-md text-sm text-texte-doux">{children}</div>}
    </div>
  )
}
