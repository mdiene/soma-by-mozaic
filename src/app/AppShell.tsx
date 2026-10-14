import { LogOut, Menu, X } from 'lucide-react'
import { Suspense, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@/auth/contexte'
import { Chargement } from '@/components/Etats'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { MODULES } from './modules'

export function AppShell() {
  const { aRole, session, appartenances, deconnexion } = useAuth()
  const [menuOuvert, setMenuOuvert] = useState(false)
  const visibles = MODULES.filter((m) => aRole(m.roles))
  const organisations = [...new Set(appartenances.map((a) => a.organisationNom))]

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[264px_1fr]">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-66 overflow-y-auto bg-nuit-950 text-nuit-100 transition-transform lg:static lg:translate-x-0',
          menuOuvert ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex w-7 flex-col gap-0.5" aria-hidden>
              <span className="h-1 rounded bg-soma-orange" />
              <span className="h-1 rounded bg-soma-or" />
              <span className="h-1 rounded bg-soma-vert" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">SOMA by Mozaïc</p>
              <p className="text-xs text-nuit-300">Système d’information</p>
            </div>
          </div>
          <button className="lg:hidden" onClick={() => setMenuOuvert(false)} aria-label="Fermer le menu">
            <X className="size-5" />
          </button>
        </div>
        <nav className="space-y-5 px-3 pb-6" aria-label="Modules">
          {visibles.map((m) => (
            <div key={m.id}>
              <p className="mb-1 flex items-center gap-2 px-2 text-xs font-semibold tracking-wide text-nuit-300 uppercase">
                <m.icone className="size-3.5" aria-hidden /> {m.libelle}
                {m.phase > 1 && <span className="ml-auto shrink-0 text-[10px] font-normal whitespace-nowrap normal-case text-nuit-500">phase {m.phase}</span>}
              </p>
              {m.pages.map((p) => (
                <NavLink
                  key={p.chemin}
                  to={`/${m.id}${p.chemin ? `/${p.chemin}` : ''}`}
                  end
                  onClick={() => setMenuOuvert(false)}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-md px-3 py-1.5 text-sm transition-colors',
                      isActive ? 'bg-nuit-800 font-medium text-white' : 'text-nuit-200 hover:bg-nuit-900 hover:text-white',
                    )
                  }
                >
                  {p.libelle}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-bordure bg-surface/95 px-4 backdrop-blur lg:px-8">
          <button className="lg:hidden" onClick={() => setMenuOuvert(true)} aria-label="Ouvrir le menu">
            <Menu className="size-5" />
          </button>
          <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
            {organisations.map((o) => (
              <Badge key={o}>{o}</Badge>
            ))}
          </div>
          <span className="hidden truncate text-sm text-texte-doux sm:block">{session?.user.email}</span>
          <button onClick={deconnexion} className="rounded-md p-2 text-texte-doux hover:bg-nuit-50 hover:text-texte" aria-label="Se déconnecter" title="Se déconnecter">
            <LogOut className="size-4" />
          </button>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <Suspense fallback={<Chargement />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      {menuOuvert && <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setMenuOuvert(false)} aria-hidden />}
    </div>
  )
}
