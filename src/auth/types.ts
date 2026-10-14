import type { Database } from '@/lib/database.types'

export type RoleApp = Database['core']['Enums']['role_app']

export interface Appartenance {
  organisationId: string
  organisationCode: string
  organisationNom: string
  role: RoleApp
}

export const LIBELLES_ROLES: Record<RoleApp, string> = {
  admin: 'Administrateur',
  direction: 'Direction',
  finance: 'Finance',
  comptable: 'Comptable',
  logistique: 'Logistique',
  chef_site: 'Chef de site',
  mine: 'Exploitation minière',
  hqse: 'HQSE',
  rh: 'Ressources humaines',
  chauffeur: 'Chauffeur',
  lecteur: 'Lecture seule',
}
