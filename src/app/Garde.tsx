import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/auth/contexte'
import type { RoleApp } from '@/auth/types'
import { Chargement, Vide } from '@/components/Etats'

/** Exige une session ; avec `roles`, exige aussi l'un de ces rôles. */
export function Garde({ roles, children }: { roles?: readonly RoleApp[]; children: ReactNode }) {
  const { initialise, session, appartenancesChargees, aRole } = useAuth()
  if (!initialise) return <Chargement />
  if (!session) return <Navigate to="/connexion" replace />
  if (!appartenancesChargees) return <Chargement texte="Chargement de vos droits…" />
  if (!aRole()) {
    return (
      <Vide titre="Compte sans rôle">
        Votre compte est actif mais n’est rattaché à aucune société. Demandez à un administrateur de vous attribuer un rôle.
      </Vide>
    )
  }
  if (roles && !aRole(roles)) return <Vide titre="Accès réservé">Ce module n’est pas ouvert à votre rôle.</Vide>
  return <>{children}</>
}
