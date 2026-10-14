import { date, fcfa, pct, tauxRealisation, tonnes } from './format'

const espace = /[\s  ]/g
const normaliser = (s: string) => s.replace(espace, ' ')

describe('format', () => {
  it('formate les montants en FCFA', () => {
    expect(normaliser(fcfa(1250000))).toBe('1 250 000 FCFA')
    expect(fcfa(null)).toBe('—')
    expect(normaliser(fcfa('8300000'))).toBe('8 300 000 FCFA')
  })

  it('formate les tonnages', () => {
    expect(normaliser(tonnes(1234.5))).toBe('1 234,5 t')
    expect(tonnes(undefined)).toBe('—')
  })

  it('formate les dates au format français', () => {
    expect(date('2026-10-14')).toBe('14/10/2026')
    expect(date(null)).toBe('—')
  })

  it('calcule le taux de réalisation', () => {
    expect(tauxRealisation(50, 200)).toBe(25)
    expect(tauxRealisation(10, 0)).toBeNull()
    expect(normaliser(pct(12.345))).toBe('12,3 %')
  })
})
