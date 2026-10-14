import { useSearchParams } from 'react-router-dom'

/** Phase sélectionnée, portée par l'URL (?phase=…) pour être partageable. */
export function usePhase(): [string | null, (v: string | null) => void] {
  const [params, setParams] = useSearchParams()
  const phase = params.get('phase')
  const changer = (v: string | null) =>
    setParams(
      (p) => {
        if (v) p.set('phase', v)
        else p.delete('phase')
        return p
      },
      { replace: true },
    )
  return [phase, changer]
}
