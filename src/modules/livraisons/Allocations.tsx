import { useMemo, useState } from 'react'
import { Chargement, Erreur, Vide } from '@/components/Etats'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input, Select } from '@/components/ui/field'
import { Table, Td, Th } from '@/components/ui/table'
import { pct, tonnes } from '@/lib/format'
import { useAllocations } from './api'
import { SelecteurProjet } from './SelecteurProjet'
import { STATUTS_ALLOCATION } from './statut'
import { usePhase } from './usePhase'

export default function Allocations() {
  const [phase, setPhase] = usePhase()
  const [recherche, setRecherche] = useState('')
  const [statut, setStatut] = useState('')
  const { data, isLoading, error } = useAllocations(phase)

  const lignes = useMemo(() => {
    const terme = recherche.trim().toLowerCase()
    return (data ?? []).filter(
      (a) =>
        (!statut || a.statut === statut) &&
        (!terme || [a.operateur, a.commune, a.departement, a.region, a.allocation_key, a.responsable].some((v) => v?.toLowerCase().includes(terme))),
    )
  }, [data, recherche, statut])

  return (
    <>
      <PageHeader titre="Allocations" sousTitre="Quotas par opérateur et par commune, avec l’avancement des livraisons." actions={<SelecteurProjet valeur={phase} onChange={setPhase} />} />
      <Card>
        <div className="flex flex-wrap gap-3 border-b border-bordure p-4">
          <Input className="max-w-xs" placeholder="Opérateur, commune, clé…" value={recherche} onChange={(e) => setRecherche(e.target.value)} aria-label="Rechercher" />
          <Select className="w-auto" value={statut} onChange={(e) => setStatut(e.target.value)} aria-label="Statut">
            <option value="">Tous les statuts</option>
            {Object.entries(STATUTS_ALLOCATION).map(([k, v]) => (
              <option key={k} value={k}>{v.libelle}</option>
            ))}
          </Select>
          <span className="ml-auto self-center text-sm text-texte-doux">{lignes.length} allocation(s)</span>
        </div>
        {error && <div className="p-4"><Erreur erreur={error} /></div>}
        {isLoading ? (
          <Chargement />
        ) : lignes.length === 0 ? (
          <Vide titre="Aucune allocation" />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Opérateur</Th>
                <Th>Localisation</Th>
                <Th>Phase</Th>
                <Th num>Cible</Th>
                <Th num>Livré</Th>
                <Th num>Taux</Th>
                <Th>Statut</Th>
              </tr>
            </thead>
            <tbody>
              {lignes.map((a) => {
                const s = STATUTS_ALLOCATION[a.statut ?? ''] ?? { libelle: a.statut ?? '—', ton: 'neutre' as const }
                return (
                  <tr key={a.id} className="hover:bg-nuit-50/60">
                    <Td>
                      <p className="font-medium">{a.operateur}</p>
                      <p className="text-xs text-texte-doux">{a.allocation_key} · {a.responsable}</p>
                    </Td>
                    <Td>
                      <p>{a.commune}</p>
                      <p className="text-xs text-texte-doux">{a.departement} · {a.region}</p>
                    </Td>
                    <Td>{a.numero_phase ?? '—'}</Td>
                    <Td num>{tonnes(a.tonnage_cible)}</Td>
                    <Td num>{tonnes(a.tonnage_livre)}</Td>
                    <Td num>{pct(a.taux_pct)}</Td>
                    <Td><Badge ton={s.ton}>{s.libelle}</Badge></Td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  )
}
