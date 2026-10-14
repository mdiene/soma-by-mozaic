import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { LIBELLES_ROLES, type RoleApp } from '@/auth/types'
import { Chargement, Erreur, Vide } from '@/components/Etats'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Field, Select } from '@/components/ui/field'
import { Table, Td, Th } from '@/components/ui/table'
import { useOrganisations } from '@/hooks/useReferentiel'
import { db, verifier } from '@/lib/supabase'

export default function Utilisateurs() {
  const client = useQueryClient()
  const organisations = useOrganisations()
  const profils = useQuery({
    queryKey: ['core', 'profils'],
    queryFn: async () =>
      verifier(
        await db.core().from('profiles').select('id, email, nom_complet, actif, memberships!memberships_user_id_fkey ( id, role, organisation_id )').order('email'),
      ),
  })
  const [form, setForm] = useState<{ user: string; org: string; role: RoleApp }>({ user: '', org: '', role: 'lecteur' })

  const rafraichir = () => {
    client.invalidateQueries({ queryKey: ['core', 'profils'] })
    client.invalidateQueries({ queryKey: ['appartenances'] })
  }
  const ajouter = useMutation({
    mutationFn: async () => {
      if (!form.user || !form.org) throw new Error('Choisissez un utilisateur et une société.')
      verifier(await db.core().from('memberships').insert({ user_id: form.user, organisation_id: form.org, role: form.role }))
    },
    onSuccess: () => { toast.success('Rôle attribué'); rafraichir() },
    onError: (e) => toast.error(e.message.includes('duplicate') ? 'Ce rôle est déjà attribué.' : e.message),
  })
  const retirer = useMutation({
    mutationFn: async (id: string) => verifier(await db.core().from('memberships').delete().eq('id', id)),
    onSuccess: () => { toast.success('Rôle retiré'); rafraichir() },
    onError: (e) => toast.error(e.message),
  })
  const nomOrg = (id: string) => organisations.data?.find((o) => o.id === id)?.nom ?? '—'

  return (
    <>
      <PageHeader
        titre="Utilisateurs et rôles"
        sousTitre="Les comptes se créent par invitation depuis Supabase (Authentication › Users › Invite). Les droits s’attribuent ici, par société."
      />
      <Card className="mb-6">
        <CardHeader titre="Attribuer un rôle" />
        <CardBody>
          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Utilisateur">
              <Select value={form.user} onChange={(e) => setForm({ ...form, user: e.target.value })}>
                <option value="">—</option>
                {profils.data?.map((p) => <option key={p.id} value={p.id}>{p.email}</option>)}
              </Select>
            </Field>
            <Field label="Société">
              <Select value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })}>
                <option value="">—</option>
                {organisations.data?.map((o) => <option key={o.id} value={o.id}>{o.nom}</option>)}
              </Select>
            </Field>
            <Field label="Rôle">
              <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as RoleApp })}>
                {Object.entries(LIBELLES_ROLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
            </Field>
            <div className="flex items-end">
              <Button onClick={() => ajouter.mutate()} disabled={ajouter.isPending}>Attribuer</Button>
            </div>
          </div>
          <p className="mt-3 text-xs text-texte-doux">Un rôle attribué sur « Groupe Mozaïc » s’applique à toutes les sociétés du groupe.</p>
        </CardBody>
      </Card>
      <Card>
        {profils.error && <div className="p-4"><Erreur erreur={profils.error} /></div>}
        {profils.isLoading ? (
          <Chargement />
        ) : (profils.data ?? []).length === 0 ? (
          <Vide titre="Aucun utilisateur" />
        ) : (
          <Table>
            <thead>
              <tr><Th>Utilisateur</Th><Th>Rôles</Th></tr>
            </thead>
            <tbody>
              {profils.data?.map((p) => (
                <tr key={p.id}>
                  <Td>
                    <p className="font-medium">{p.nom_complet ?? p.email}</p>
                    <p className="text-xs text-texte-doux">{p.email}</p>
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-2">
                      {p.memberships.length === 0 && <span className="text-texte-doux">Aucun rôle</span>}
                      {p.memberships.map((m) => (
                        <Badge key={m.id} ton={m.role === 'admin' ? 'alerte' : 'neutre'} className="gap-1.5">
                          {LIBELLES_ROLES[m.role]} · {nomOrg(m.organisation_id)}
                          <button onClick={() => retirer.mutate(m.id)} aria-label={`Retirer le rôle ${LIBELLES_ROLES[m.role]}`} className="opacity-60 hover:opacity-100">
                            <Trash2 className="size-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  )
}
