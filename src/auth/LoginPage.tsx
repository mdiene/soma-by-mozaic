import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/field'
import { supabase } from '@/lib/supabase'
import { useAuth } from './contexte'

const schema = z.object({
  email: z.email('Adresse e-mail invalide'),
  motDePasse: z.string().min(1, 'Mot de passe requis'),
})
type Formulaire = z.infer<typeof schema>

export function LoginPage() {
  const { session } = useAuth()
  const [message, setMessage] = useState<{ ton: 'erreur' | 'info'; texte: string } | null>(null)
  const { register, handleSubmit, getValues, formState } = useForm<Formulaire>({ resolver: zodResolver(schema) })

  if (session) return <Navigate to="/" replace />

  const connexion = handleSubmit(async ({ email, motDePasse }) => {
    setMessage(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password: motDePasse })
    if (error) setMessage({ ton: 'erreur', texte: 'Identifiants incorrects ou compte inactif.' })
  })

  const oubli = async () => {
    const email = getValues('email')
    if (!z.email().safeParse(email).success) {
      setMessage({ ton: 'erreur', texte: 'Saisissez d’abord votre adresse e-mail.' })
      return
    }
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/mot-de-passe` })
    setMessage({ ton: 'info', texte: 'Si ce compte existe, un lien de réinitialisation vient d’être envoyé.' })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-nuit-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex w-16 flex-col gap-1" aria-hidden>
            <span className="h-1.5 rounded bg-soma-orange" />
            <span className="h-1.5 rounded bg-soma-or" />
            <span className="h-1.5 rounded bg-soma-vert" />
          </div>
          <h1 className="text-xl font-semibold text-white">SOMA by Mozaïc</h1>
          <p className="text-sm text-nuit-300">Système d’information de la Société Minière Africaine</p>
        </div>
        <form onSubmit={connexion} className="space-y-4 rounded-xl bg-surface p-6 shadow-xl" noValidate>
          <Field label="Adresse e-mail" erreur={formState.errors.email?.message}>
            <Input type="email" autoComplete="email" {...register('email')} />
          </Field>
          <Field label="Mot de passe" erreur={formState.errors.motDePasse?.message}>
            <Input type="password" autoComplete="current-password" {...register('motDePasse')} />
          </Field>
          {message && (
            <p className={message.ton === 'erreur' ? 'text-sm text-danger' : 'text-sm text-succes'} role="status">
              {message.texte}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? 'Connexion…' : 'Se connecter'}
          </Button>
          <button type="button" onClick={oubli} className="w-full text-center text-sm text-texte-doux hover:text-texte">
            Mot de passe oublié ?
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-nuit-300">Accès sur invitation de l’administrateur.</p>
      </div>
    </div>
  )
}
