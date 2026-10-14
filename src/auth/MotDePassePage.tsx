import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Field, Input } from '@/components/ui/field'
import { Chargement } from '@/components/Etats'
import { supabase } from '@/lib/supabase'
import { useAuth } from './contexte'

const schema = z
  .object({
    motDePasse: z.string().min(10, '10 caractères minimum'),
    confirmation: z.string(),
  })
  .refine((v) => v.motDePasse === v.confirmation, { path: ['confirmation'], message: 'Les deux saisies diffèrent' })
type Formulaire = z.infer<typeof schema>

/** Définition du mot de passe après une invitation ou une réinitialisation. */
export function MotDePassePage() {
  const { initialise, session } = useAuth()
  const naviguer = useNavigate()
  const [erreur, setErreur] = useState<string | null>(null)
  const { register, handleSubmit, formState } = useForm<Formulaire>({ resolver: zodResolver(schema) })

  const enregistrer = handleSubmit(async ({ motDePasse }) => {
    const { error } = await supabase.auth.updateUser({ password: motDePasse })
    if (error) setErreur(error.message)
    else naviguer('/', { replace: true })
  })

  if (!initialise) return <Chargement />
  // Le lien d'invitation / de réinitialisation ouvre une session ; sans elle, retour à la connexion.
  if (!session) return <Navigate to="/connexion" replace />

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card>
        <CardHeader titre="Définir votre mot de passe" description="Choisissez un mot de passe d’au moins 10 caractères." />
        <CardBody>
          <form onSubmit={enregistrer} className="space-y-4" noValidate>
            <Field label="Nouveau mot de passe" erreur={formState.errors.motDePasse?.message}>
              <Input type="password" autoComplete="new-password" {...register('motDePasse')} />
            </Field>
            <Field label="Confirmation" erreur={formState.errors.confirmation?.message}>
              <Input type="password" autoComplete="new-password" {...register('confirmation')} />
            </Field>
            {erreur && <p className="text-sm text-danger">{erreur}</p>}
            <Button type="submit" disabled={formState.isSubmitting}>Enregistrer</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
