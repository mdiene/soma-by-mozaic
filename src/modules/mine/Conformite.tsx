import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useAuth } from '@/auth/contexte'
import { Chargement, Erreur, Vide } from '@/components/Etats'
import { PageHeader } from '@/components/PageHeader'
import { Badge, type Ton } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Field, Input, Select, Textarea } from '@/components/ui/field'
import { Stat } from '@/components/ui/stat'
import { Table, Td, Th } from '@/components/ui/table'
import { useOrganisationParDefaut } from '@/hooks/useReferentiel'
import type { Database } from '@/lib/database.types'
import { date, entier, fcfa } from '@/lib/format'
import { db, verifier } from '@/lib/supabase'

type TypeObligation = Database['mine']['Enums']['type_obligation']

const TYPES: Record<TypeObligation, string> = {
  redevance_miniere: 'Redevance minière',
  taxe_superficiaire: 'Taxe superficiaire',
  droits_fixes: 'Droits fixes',
  rapport_trimestriel: 'Rapport trimestriel',
  rapport_annuel: 'Rapport annuel',
  eies: 'EIES',
  pges_suivi: 'Suivi du PGES',
  plan_rehabilitation: 'Plan de réhabilitation',
  declaration_production: 'Déclaration de production',
  autre: 'Autre',
}

const ALERTES: Record<string, { libelle: string; ton: Ton }> = {
  en_retard: { libelle: 'En retard', ton: 'danger' },
  echeance_proche: { libelle: 'Échéance < 30 j', ton: 'alerte' },
  a_jour: { libelle: 'À venir', ton: 'info' },
  soldee: { libelle: 'Soldée', ton: 'succes' },
  sans_echeance: { libelle: 'Sans échéance', ton: 'neutre' },
}

const schema = z.object({
  type_obligation: z.enum(Object.keys(TYPES) as [TypeObligation, ...TypeObligation[]]),
  libelle: z.string().trim().min(3, 'Libellé trop court'),
  titre_id: z.string().optional(),
  periode_debut: z.string().optional(),
  periode_fin: z.string().optional(),
  echeance: z.string().optional(),
  montant_du: z.string().optional().refine((v) => !v || Number(v) >= 0, 'Montant invalide'),
  notes: z.string().optional(),
})
type Formulaire = z.infer<typeof schema>

function useTitres() {
  return useQuery({
    queryKey: ['mine', 'titres'],
    queryFn: async () => verifier(await db.mine().from('titres').select('id, code, intitule, reference_acte, statut, date_expiration').order('code')),
  })
}

function useObligations() {
  return useQuery({
    queryKey: ['mine', 'obligations'],
    queryFn: async () => verifier(await db.mine().from('v_obligations_suivi').select('*').order('echeance', { ascending: true, nullsFirst: false })),
  })
}

function NouvelleObligation({ onFermer }: { onFermer: () => void }) {
  const organisation = useOrganisationParDefaut()
  const titres = useTitres()
  const client = useQueryClient()
  const { register, handleSubmit, formState } = useForm<Formulaire>({
    resolver: zodResolver(schema),
    defaultValues: { type_obligation: 'redevance_miniere' },
  })

  const creer = useMutation({
    mutationFn: async (v: Formulaire) => {
      if (!organisation) throw new Error('Aucune société disponible pour votre compte.')
      verifier(
        await db.mine().from('obligations').insert({
          organisation_id: organisation,
          type_obligation: v.type_obligation,
          libelle: v.libelle,
          titre_id: v.titre_id || null,
          periode_debut: v.periode_debut || null,
          periode_fin: v.periode_fin || null,
          echeance: v.echeance || null,
          montant_du: v.montant_du ? Number(v.montant_du) : null,
          statut: 'a_venir',
          notes: v.notes || null,
        }),
      )
    },
    onSuccess: () => {
      toast.success('Obligation enregistrée')
      client.invalidateQueries({ queryKey: ['mine', 'obligations'] })
      onFermer()
    },
    onError: (e) => toast.error(e.message),
  })

  return (
    <Card className="mb-6">
      <CardHeader titre="Nouvelle obligation" description="Redevance, taxe, rapport ou étude exigé par l’administration des mines." />
      <CardBody>
        <form onSubmit={handleSubmit((v) => creer.mutate(v))} className="grid gap-4 md:grid-cols-3" noValidate>
          <Field label="Type">
            <Select {...register('type_obligation')}>
              {Object.entries(TYPES).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
          </Field>
          <Field label="Libellé" erreur={formState.errors.libelle?.message} className="md:col-span-2">
            <Input placeholder="ex. Redevance minière T3 2026" {...register('libelle')} />
          </Field>
          <Field label="Titre minier">
            <Select {...register('titre_id')}>
              <option value="">—</option>
              {titres.data?.map((t) => (
                <option key={t.id} value={t.id}>{t.code} — {t.intitule}</option>
              ))}
            </Select>
          </Field>
          <Field label="Début de période"><Input type="date" {...register('periode_debut')} /></Field>
          <Field label="Fin de période"><Input type="date" {...register('periode_fin')} /></Field>
          <Field label="Échéance"><Input type="date" {...register('echeance')} /></Field>
          <Field label="Montant dû (FCFA)" erreur={formState.errors.montant_du?.message}>
            <Input type="number" min={0} step="1" inputMode="numeric" {...register('montant_du')} />
          </Field>
          <Field label="Notes" className="md:col-span-3"><Textarea {...register('notes')} /></Field>
          <div className="flex gap-2 md:col-span-3">
            <Button type="submit" disabled={creer.isPending}>Enregistrer</Button>
            <Button variante="secondaire" onClick={onFermer}>Annuler</Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}

export default function Conformite() {
  const { aRole } = useAuth()
  const [ajout, setAjout] = useState(false)
  const titres = useTitres()
  const obligations = useObligations()
  const lignes = obligations.data ?? []
  const enRetard = lignes.filter((o) => o.alerte === 'en_retard')
  const proches = lignes.filter((o) => o.alerte === 'echeance_proche')
  const reste = lignes.reduce((s, o) => s + Number(o.reste_a_payer ?? 0), 0)
  const peutSaisir = aRole(['mine', 'direction', 'finance'])

  return (
    <>
      <PageHeader
        titre="Conformité du titre minier"
        sousTitre="Redevances, taxe superficiaire, droits fixes, rapports et études exigés pour le périmètre de Matam."
        actions={peutSaisir && !ajout && <Button onClick={() => setAjout(true)}><Plus className="size-4" /> Nouvelle obligation</Button>}
      />
      {ajout && <NouvelleObligation onFermer={() => setAjout(false)} />}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat libelle="Titres actifs" valeur={entier(titres.data?.filter((t) => t.statut === 'actif').length ?? 0)} contexte={titres.data?.[0]?.reference_acte ?? undefined} />
        <Stat libelle="Obligations en retard" valeur={entier(enRetard.length)} accent="orange" />
        <Stat libelle="Échéances sous 30 jours" valeur={entier(proches.length)} accent="or" />
        <Stat libelle="Reste à payer" valeur={fcfa(reste)} />
      </div>

      <Card>
        <CardHeader titre="Obligations" description="Triées par échéance" />
        {obligations.error && <div className="p-4"><Erreur erreur={obligations.error} /></div>}
        {obligations.isLoading ? (
          <Chargement />
        ) : lignes.length === 0 ? (
          <Vide titre="Aucune obligation enregistrée">
            Saisissez les redevances, taxes et rapports dus pour suivre les échéances et éviter les mises en demeure.
          </Vide>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Obligation</Th>
                <Th>Période</Th>
                <Th>Échéance</Th>
                <Th num>Dû</Th>
                <Th num>Payé</Th>
                <Th>Suivi</Th>
              </tr>
            </thead>
            <tbody>
              {lignes.map((o) => {
                const a = ALERTES[o.alerte ?? ''] ?? { libelle: o.alerte ?? '—', ton: 'neutre' as const }
                return (
                  <tr key={o.id}>
                    <Td>
                      <p className="font-medium">{o.libelle}</p>
                      <p className="text-xs text-texte-doux">{TYPES[o.type_obligation as TypeObligation] ?? o.type_obligation}{o.titre_code && ` · ${o.titre_code}`}</p>
                    </Td>
                    <Td>{o.periode_debut ? `${date(o.periode_debut)} → ${date(o.periode_fin)}` : '—'}</Td>
                    <Td>{date(o.echeance)}</Td>
                    <Td num>{fcfa(o.montant_du)}</Td>
                    <Td num>{fcfa(o.montant_paye)}</Td>
                    <Td>
                      <Badge ton={a.ton}>{a.libelle}{o.jours_de_retard ? ` · ${o.jours_de_retard} j` : ''}</Badge>
                      {o.reference_paiement && <p className="mt-1 text-xs text-texte-doux">{o.reference_paiement}</p>}
                    </Td>
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
