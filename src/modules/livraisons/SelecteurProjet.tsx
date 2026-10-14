import { Select } from '@/components/ui/field'
import { tonnes } from '@/lib/format'
import { useProjets } from './api'

/** Filtre « phase / mise à disposition » commun aux écrans Livraisons. */
export function SelecteurProjet({ valeur, onChange }: { valeur: string | null; onChange: (v: string | null) => void }) {
  const { data } = useProjets()
  return (
    <label className="flex w-full items-center gap-2 text-sm sm:w-auto">
      <span className="text-texte-doux">Phase</span>
      <Select className="min-w-0 flex-1 sm:w-auto sm:min-w-64" value={valeur ?? ''} onChange={(e) => onChange(e.target.value || null)}>
        <option value="">Toutes les phases</option>
        {data?.map((p) => (
          <option key={p.project_id} value={p.project_id ?? ''}>
            Phase {p.numero_phase} — {p.numero_bon_disposition || p.numero_marche || 'sans référence'} ({tonnes(p.tonnage_mis_a_disposition)})
          </option>
        ))}
      </Select>
    </label>
  )
}
