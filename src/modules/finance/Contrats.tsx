import { useQuery } from '@tanstack/react-query'
import { Chargement, Erreur, Vide } from '@/components/Etats'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/ui/card'
import { Stat } from '@/components/ui/stat'
import { Table, Td, Th } from '@/components/ui/table'
import { entier, fcfa, pct, tauxRealisation, tonnes } from '@/lib/format'
import { db, verifier } from '@/lib/supabase'

export default function Contrats() {
  const contrats = useQuery({
    queryKey: ['finance', 'execution-contrats'],
    queryFn: async () => verifier(await db.finance().from('v_execution_contrats').select('*').order('code')),
  })
  const factures = useQuery({
    queryKey: ['finance', 'factures-soldes'],
    queryFn: async () =>
      verifier(await db.finance().from('v_factures_soldes').select('id, sens, reste_du, jours_de_retard, statut').in('statut', ['emise', 'partiellement_reglee'])),
  })

  const lignes = contrats.data ?? []
  const caTheorique = lignes.reduce((s, c) => s + Number(c.ca_livre_theorique ?? 0), 0)
  const creances = (factures.data ?? []).filter((f) => f.sens === 'vente').reduce((s, f) => s + Number(f.reste_du ?? 0), 0)
  const enRetard = (factures.data ?? []).filter((f) => f.sens === 'vente' && Number(f.jours_de_retard ?? 0) > 0).length

  return (
    <>
      <PageHeader titre="Contrats de vente" sousTitre="Programmes de livraison : tonnage contractuel, tonnage livré (BL) et chiffre d’affaires correspondant." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat libelle="CA livré (théorique)" valeur={fcfa(caTheorique)} contexte="tonnage livré × prix contractuel" accent="vert" />
        <Stat libelle="Créances clients" valeur={fcfa(creances)} contexte="factures émises non soldées" accent="or" />
        <Stat libelle="Factures en retard" valeur={entier(enRetard)} accent="orange" />
      </div>
      <Card>
        {contrats.error && <div className="p-4"><Erreur erreur={contrats.error} /></div>}
        {contrats.isLoading ? (
          <Chargement />
        ) : lignes.length === 0 ? (
          <Vide titre="Aucun contrat enregistré">
            Créez un contrat par programme (ex. Programme Sénégal 2025-2026, Gambie 2026) et rattachez-y les phases de livraison
            pour suivre automatiquement le tonnage livré et le chiffre d’affaires.
          </Vide>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Contrat</Th>
                <Th>Client</Th>
                <Th num>Contractuel</Th>
                <Th num>Livré</Th>
                <Th num>Exécution</Th>
                <Th num>Prix / t</Th>
                <Th num>CA livré</Th>
              </tr>
            </thead>
            <tbody>
              {lignes.map((c) => (
                <tr key={c.contrat_id}>
                  <Td>
                    <p className="font-medium">{c.intitule}</p>
                    <p className="text-xs text-texte-doux">{c.code} · {entier(c.nombre_bl)} BL</p>
                  </Td>
                  <Td>{c.client}</Td>
                  <Td num>{tonnes(c.tonnage_contractuel)}</Td>
                  <Td num>{tonnes(c.tonnage_livre)}</Td>
                  <Td num>{pct(c.taux_execution_pct ?? tauxRealisation(c.tonnage_livre, c.tonnage_contractuel))}</Td>
                  <Td num>{fcfa(c.prix_unitaire_t)}</Td>
                  <Td num>{fcfa(c.ca_livre_theorique)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  )
}
