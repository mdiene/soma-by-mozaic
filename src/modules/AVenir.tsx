import { useLocation } from 'react-router-dom'
import { Vide } from '@/components/Etats'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/ui/card'

/** Module prévu en phase 3 : les données existent dans les tables historiques. */
export default function AVenir() {
  const { pathname } = useLocation()
  const module = pathname.split('/')[1] === 'rh' ? 'RH & paie' : 'HQSE'
  return (
    <>
      <PageHeader titre={module} />
      <Card>
        <Vide titre="Module programmé en phase 3">
          Les données de l’ancienne application (personnel, équipements, inspections, signalements) sont conservées et seront reprises
          dans ce module. Voir la feuille de route dans docs/ARCHITECTURE.md.
        </Vide>
      </Card>
    </>
  )
}
