import { CO2_MAX } from './simulation'
import type { GameState } from './types'

/** Argent de référence : une partie avec MONEY_REF, 0 CO₂ et 100/100 partout = 100 points. */
export const MONEY_REF = 3000

export function computeScore(state: Pick<GameState, 'money' | 'co2' | 'wellbeing' | 'privacy'>): number {
  const money = Math.max(0, state.money)
  const co2Factor = Math.max(0, 1 - state.co2 / CO2_MAX)
  const raw = money * co2Factor * (state.wellbeing / 100) * (state.privacy / 100)
  return Math.min(100, Math.round((raw / MONEY_REF) * 100))
}
