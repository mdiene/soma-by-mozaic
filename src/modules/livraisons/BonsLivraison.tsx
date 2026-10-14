import { useEffect, useState } from 'react'
import { Chargement, Erreur, Vide } from '@/components/Etats'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/field'
import { Table, Td, Th } from '@/components/ui/table'
import { date, entier, fcfa, tonnes } from '@/lib/format'
import { TAILLE_PAGE, useBons } from './api'
import { SelecteurProjet } from './SelecteurProjet'
import { usePhase } from './usePhase'

export default function BonsLivraison() {
  const [phase, setPhase] = usePhase()
  const [saisie, setSaisie] = useState('')
  const [recherche, setRecherche] = useState('')
  const [page, setPage] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => {
      setRecherche(saisie)
      setPage(0)
    }, 300)
    return () => clearTimeout(t)
  }, [saisie])

  const { data, isLoading, isFetching, error } = useBons(phase, page, recherche)
  const total = data?.total ?? 0
  const pages = Math.max(1, Math.ceil(total / TAILLE_PAGE))

  return (
    <>
      <PageHeader
        titre="Bons de livraison"
        sousTitre="Registre des BL émis, avec camion, chauffeur et frais de transport."
        actions={<SelecteurProjet valeur={phase} onChange={(v) => { setPhase(v); setPage(0) }} />}
      />
      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-bordure p-4">
          <Input className="max-w-xs" placeholder="N° BL, immatriculation, opérateur…" value={saisie} onChange={(e) => setSaisie(e.target.value)} aria-label="Rechercher" />
          <span className="ml-auto text-sm text-texte-doux">{entier(total)} BL{isFetching && ' · actualisation…'}</span>
        </div>
        {error && <div className="p-4"><Erreur erreur={error} /></div>}
        {isLoading ? (
          <Chargement />
        ) : !data || data.lignes.length === 0 ? (
          <Vide titre="Aucun bon de livraison" />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>BL</Th>
                <Th>Date</Th>
                <Th>Destination</Th>
                <Th>Transport</Th>
                <Th num>Tonnage</Th>
                <Th num>Frais</Th>
              </tr>
            </thead>
            <tbody>
              {data.lignes.map((b) => (
                <tr key={b.id} className="hover:bg-nuit-50/60">
                  <Td>
                    <p className="font-medium">{b.bl_number}</p>
                    <p className="text-xs text-texte-doux">Phase {b.numero_phase ?? '—'}</p>
                  </Td>
                  <Td>{date(b.delivery_date)}</Td>
                  <Td>
                    <p>{b.operateur}</p>
                    <p className="text-xs text-texte-doux">{b.commune} · {b.region}</p>
                  </Td>
                  <Td>
                    <p className="flex items-center gap-2">
                      {b.immatriculation ?? '—'}
                      {b.camion_interne !== null && <Badge ton={b.camion_interne ? 'info' : 'neutre'}>{b.camion_interne ? 'Interne' : 'Externe'}</Badge>}
                    </p>
                    <p className="text-xs text-texte-doux">{b.chauffeur ?? '—'}</p>
                  </Td>
                  <Td num>{tonnes(b.tonnage_loaded)}</Td>
                  <Td num>{Number(b.frais_total) > 0 ? fcfa(b.frais_total) : '—'}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <div className="flex items-center justify-end gap-2 p-4">
          <span className="mr-2 text-sm text-texte-doux">Page {page + 1} / {pages}</span>
          <Button variante="secondaire" taille="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Précédente</Button>
          <Button variante="secondaire" taille="sm" disabled={page + 1 >= pages} onClick={() => setPage((p) => p + 1)}>Suivante</Button>
        </div>
      </Card>
    </>
  )
}
