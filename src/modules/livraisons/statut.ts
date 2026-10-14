import type { Ton } from '@/components/ui/badge'

export const STATUTS_ALLOCATION: Record<string, { libelle: string; ton: Ton }> = {
  OPEN: { libelle: 'Ouverte', ton: 'neutre' },
  IN_PROGRESS: { libelle: 'En cours', ton: 'info' },
  COMPLETED: { libelle: 'Soldée', ton: 'succes' },
  CLOSED: { libelle: 'Clôturée', ton: 'succes' },
  OVER_DELIVERED: { libelle: 'Dépassée', ton: 'alerte' },
}
