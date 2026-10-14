import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Chargement, Erreur, Vide } from '@/components/Etats'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/field'
import { Table, Td, Th } from '@/components/ui/table'
import { fcfa } from '@/lib/format'
import { useOrganisations } from '@/hooks/useReferentiel'
import { db, verifier } from '@/lib/supabase'

const CLASSES: Record<number, string> = {
  1: 'Ressources durables', 2: 'Actif immobilisé', 3: 'Stocks', 4: 'Tiers', 5: 'Trésorerie',
  6: 'Charges', 7: 'Produits', 8: 'Autres charges et produits', 9: 'Analytique',
}

export default function Balance() {
  const exercices = useQuery({
    queryKey: ['finance', 'exercices'],
    queryFn: async () => verifier(await db.finance().from('exercices').select('id, code, statut, organisation_id').order('code', { ascending: false })),
  })
  const organisations = useOrganisations()
  const [choix, setChoix] = useState<string>('')
  const exercice = choix || exercices.data?.[0]?.id || ''

  const balance = useQuery({
    queryKey: ['finance', 'balance', exercice],
    enabled: Boolean(exercice),
    queryFn: async () => verifier(await db.finance().from('v_balance').select('*').eq('exercice_id', exercice).order('compte')),
  })

  const lignes = balance.data ?? []
  const total = (cle: 'total_debit' | 'total_credit' | 'solde_debiteur' | 'solde_crediteur') => lignes.reduce((s, l) => s + Number(l[cle] ?? 0), 0)

  return (
    <>
      <PageHeader
        titre="Balance générale"
        sousTitre="Écritures validées uniquement, plan comptable SYSCOHADA."
        actions={
          <Select className="w-auto" value={exercice} onChange={(e) => setChoix(e.target.value)} aria-label="Exercice">
            {exercices.data?.map((e) => (
              <option key={e.id} value={e.id}>{organisations.data?.find((o) => o.id === e.organisation_id)?.nom} — {e.code} ({e.statut})</option>
            ))}
          </Select>
        }
      />
      <Card>
        {(exercices.error || balance.error) && <div className="p-4"><Erreur erreur={exercices.error ?? balance.error} /></div>}
        {exercices.isLoading || balance.isLoading ? (
          <Chargement />
        ) : lignes.length === 0 ? (
          <Vide titre="Aucune écriture validée sur cet exercice" />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Compte</Th>
                <Th>Libellé</Th>
                <Th num>Débit</Th>
                <Th num>Crédit</Th>
                <Th num>Solde débiteur</Th>
                <Th num>Solde créditeur</Th>
              </tr>
            </thead>
            <tbody>
              {lignes.map((l, i) => (
                <tr key={l.compte}>
                  <Td className="font-mono">
                    {(i === 0 || lignes[i - 1]?.classe !== l.classe) && (
                      <span className="mb-1 block font-sans text-xs font-semibold text-texte-doux uppercase">Classe {l.classe} · {CLASSES[l.classe ?? 0]}</span>
                    )}
                    {l.compte}
                  </Td>
                  <Td>{l.libelle}</Td>
                  <Td num>{fcfa(l.total_debit)}</Td>
                  <Td num>{fcfa(l.total_credit)}</Td>
                  <Td num>{Number(l.solde_debiteur) ? fcfa(l.solde_debiteur) : ''}</Td>
                  <Td num>{Number(l.solde_crediteur) ? fcfa(l.solde_crediteur) : ''}</Td>
                </tr>
              ))}
              <tr className="font-semibold">
                <Td colSpan={2}>Totaux</Td>
                <Td num>{fcfa(total('total_debit'))}</Td>
                <Td num>{fcfa(total('total_credit'))}</Td>
                <Td num>{fcfa(total('solde_debiteur'))}</Td>
                <Td num>{fcfa(total('solde_crediteur'))}</Td>
              </tr>
            </tbody>
          </Table>
        )}
      </Card>
    </>
  )
}
