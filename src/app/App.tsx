import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/auth/AuthProvider'
import { useAuth } from '@/auth/contexte'
import { LoginPage } from '@/auth/LoginPage'
import { MotDePassePage } from '@/auth/MotDePassePage'
import { configurationManquante } from '@/lib/env'
import { AppShell } from './AppShell'
import { Garde } from './Garde'
import { MODULES } from './modules'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false } },
})

function Accueil() {
  const { aRole } = useAuth()
  const premier = MODULES.find((m) => aRole(m.roles))
  return <Navigate to={premier ? `/${premier.id}` : '/connexion'} replace />
}

function ConfigurationManquante() {
  return (
    <div className="mx-auto max-w-xl p-10 text-sm">
      <h1 className="mb-2 text-lg font-semibold">Configuration manquante</h1>
      <p>
        Copiez <code>.env.example</code> en <code>.env.local</code> et renseignez <code>VITE_SUPABASE_URL</code> et{' '}
        <code>VITE_SUPABASE_ANON_KEY</code>, puis relancez <code>npm run dev</code>.
      </p>
    </div>
  )
}

export function App() {
  if (configurationManquante) return <ConfigurationManquante />
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/connexion" element={<LoginPage />} />
            <Route path="/mot-de-passe" element={<MotDePassePage />} />
            <Route element={<Garde><AppShell /></Garde>}>
              <Route index element={<Accueil />} />
              {MODULES.map((m) => (
                <Route key={m.id} path={m.id}>
                  {m.pages.map((p) => {
                    const Page = p.composant
                    const element = <Garde roles={m.roles}><Page /></Garde>
                    return p.chemin ? <Route key={p.chemin} path={p.chemin} element={element} /> : <Route key="index" index element={element} />
                  })}
                </Route>
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  )
}
