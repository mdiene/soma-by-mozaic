import type { LucideIcon } from 'lucide-react'
import { Banknote, ClipboardList, Factory, HardHat, Mountain, Settings, ShieldCheck, Truck, Users } from 'lucide-react'
import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { RoleApp } from '@/auth/types'

export interface PageModule {
  chemin: string // relatif au module, '' = accueil du module
  libelle: string
  composant: LazyExoticComponent<ComponentType>
}

export interface ModuleSI {
  id: string
  libelle: string
  icone: LucideIcon
  /** Rôles qui voient le module (admin toujours). */
  roles: readonly RoleApp[]
  /** Phase de la feuille de route (docs/ARCHITECTURE.md). */
  phase: 1 | 2 | 3
  pages: PageModule[]
}

const tous: readonly RoleApp[] = ['direction', 'finance', 'comptable', 'logistique', 'chef_site', 'mine', 'hqse', 'rh', 'lecteur']

export const MODULES: ModuleSI[] = [
  {
    id: 'livraisons',
    libelle: 'Livraisons',
    icone: Truck,
    roles: ['direction', 'logistique', 'finance', 'chef_site', 'lecteur'],
    phase: 1,
    pages: [
      { chemin: '', libelle: 'Tableau de bord', composant: lazy(() => import('@/modules/livraisons/TableauDeBord')) },
      { chemin: 'allocations', libelle: 'Allocations', composant: lazy(() => import('@/modules/livraisons/Allocations')) },
      { chemin: 'bons', libelle: 'Bons de livraison', composant: lazy(() => import('@/modules/livraisons/BonsLivraison')) },
    ],
  },
  {
    id: 'production',
    libelle: 'Production sur site',
    icone: Factory,
    roles: ['direction', 'chef_site', 'mine', 'logistique', 'lecteur'],
    phase: 1,
    pages: [
      { chemin: '', libelle: 'Stocks', composant: lazy(() => import('@/modules/production/Stocks')) },
      { chemin: 'ensachage', libelle: 'Ensachage', composant: lazy(() => import('@/modules/production/Ensachage')) },
    ],
  },
  {
    id: 'mine',
    libelle: 'Mine de Matam',
    icone: Mountain,
    roles: ['direction', 'mine', 'chef_site', 'finance', 'lecteur'],
    phase: 2,
    pages: [
      { chemin: '', libelle: 'Conformité du titre', composant: lazy(() => import('@/modules/mine/Conformite')) },
      { chemin: 'exploitation', libelle: 'Exploitation', composant: lazy(() => import('@/modules/mine/Exploitation')) },
    ],
  },
  {
    id: 'finance',
    libelle: 'Finance & comptabilité',
    icone: Banknote,
    roles: ['direction', 'finance', 'comptable'],
    phase: 2,
    pages: [
      { chemin: '', libelle: 'Contrats de vente', composant: lazy(() => import('@/modules/finance/Contrats')) },
      { chemin: 'balance', libelle: 'Balance', composant: lazy(() => import('@/modules/finance/Balance')) },
    ],
  },
  {
    id: 'pilotage',
    libelle: 'Pilotage du programme',
    icone: ClipboardList,
    roles: tous,
    phase: 2,
    pages: [{ chemin: '', libelle: 'Programmes', composant: lazy(() => import('@/modules/pilotage/Programmes')) }],
  },
  {
    id: 'hqse',
    libelle: 'HQSE',
    icone: ShieldCheck,
    roles: ['direction', 'hqse', 'chef_site'],
    phase: 3,
    pages: [{ chemin: '', libelle: 'Vue d’ensemble', composant: lazy(() => import('@/modules/AVenir')) }],
  },
  {
    id: 'rh',
    libelle: 'RH & paie',
    icone: Users,
    roles: ['direction', 'rh'],
    phase: 3,
    pages: [{ chemin: '', libelle: 'Vue d’ensemble', composant: lazy(() => import('@/modules/AVenir')) }],
  },
  {
    id: 'administration',
    libelle: 'Administration',
    icone: Settings,
    roles: [],
    phase: 1,
    pages: [{ chemin: '', libelle: 'Utilisateurs et rôles', composant: lazy(() => import('@/modules/administration/Utilisateurs')) }],
  },
]

export const ICONE_CHANTIER = HardHat
