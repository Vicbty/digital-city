import type { GameState } from './types'

/** Réduction de CO₂ qui donne le maximum de points (au-delà, plafonné). */
export const REDUCTION_FOR_MAX = 75

/**
 * Score sur 100 : réduction de CO₂ atteinte en fin de partie, pondérée par la satisfaction des habitants
 * (un data center sobre mais qui ne rend plus le service ne gagne pas).
 */
export function computeScore(state: Pick<GameState, 'levelResults' | 'satisfaction'>): number {
  const last = state.levelResults[state.levelResults.length - 1]
  const reduction = last ? last.reductionPct : 0
  const reductionFactor = Math.min(1, Math.max(0, reduction) / REDUCTION_FOR_MAX)
  const satisfactionFactor = 0.4 + 0.6 * (state.satisfaction / 100)
  return Math.round(100 * reductionFactor * satisfactionFactor)
}

export function totalStars(state: Pick<GameState, 'levelResults'>): number {
  return state.levelResults.reduce((s, r) => s + r.stars, 0)
}
