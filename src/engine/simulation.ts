import { FAMILIES, START_LAYOUT } from './buildings'
import { LEVELS, TRADES } from './levels'
import type { CityStats, GameState, LevelResult, TradeOffer, UpgradeResult } from './types'

export const GRID_SIZE = 5
export const TURNS_PER_LEVEL = 5
export const MAX_TURNS = TURNS_PER_LEVEL * LEVELS.length
export const START_COINS = 100
export const START_SATISFACTION = 60
export const QUIZ_COINS = 40
export const STREAK_BONUS = 20 // à partir de 3 bonnes réponses d'affilée
export const STREAK_MIN = 3
export const SERVICE_INCOME = 15 // pièces par tour si la demande est couverte
export const SATISFACTION_UP = 5
export const SATISFACTION_DOWN = 10
export const SATISFIED_THRESHOLD = 70
/** Tours (dans un niveau) où un data center voisin propose un échange. */
export const TRADE_TURNS_IN_LEVEL = [2, 4]

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function levelOf(turn: number): number {
  return Math.ceil(turn / TURNS_PER_LEVEL)
}

export function turnInLevel(turn: number): number {
  return ((turn - 1) % TURNS_PER_LEVEL) + 1
}

export function computeStats(state: Pick<GameState, 'grid' | 'modifiers' | 'level' | 'startCo2'>): CityStats {
  let co2 = 0
  let capacity = 0
  let demand = LEVELS[state.level - 1].baseDemand
  let income = 0
  for (const tile of state.grid) {
    const t = FAMILIES[tile.family].tiers[tile.tier]
    co2 += t.co2
    capacity += t.capacity
    demand += t.demand
    income += t.income
  }
  for (const m of state.modifiers) {
    co2 += m.co2
    capacity += m.capacity
    demand += m.demand
  }
  co2 = Math.max(0, co2)
  demand = Math.max(0, demand)
  const reductionPct = state.startCo2 > 0 ? Math.round((1 - co2 / state.startCo2) * 100) : 0
  return { co2, capacity, demand, income, reductionPct, demandMet: capacity >= demand }
}

export function createInitialState(): GameState {
  const base = {
    grid: START_LAYOUT.map((family) => ({ family, tier: 0 as const })),
    modifiers: [],
    level: 1,
    startCo2: 0,
  }
  const startCo2 = computeStats(base).co2
  return {
    ...base,
    startCo2,
    coins: START_COINS,
    satisfaction: START_SATISFACTION,
    turn: 1,
    usedTrades: [],
    quizCorrect: 0,
    quizTotal: 0,
    streak: 0,
    levelResults: [],
    gameOver: false,
  }
}

export function upgradeCost(state: GameState, index: number): number | null {
  const tile = state.grid[index]
  if (!tile || tile.tier >= 2) return null
  return FAMILIES[tile.family].upgradeCosts[tile.tier as 0 | 1]
}

export function upgradeTile(state: GameState, index: number): UpgradeResult {
  if (state.gameOver) return { ok: false, error: 'gameOver', state }
  const tile = state.grid[index]
  if (!tile) return { ok: false, error: 'outOfBounds', state }
  if (tile.tier >= 2) return { ok: false, error: 'maxTier', state }
  const cost = FAMILIES[tile.family].upgradeCosts[tile.tier as 0 | 1]
  if (state.coins < cost) return { ok: false, error: 'notEnoughCoins', state }
  const grid = state.grid.slice()
  grid[index] = { ...tile, tier: (tile.tier + 1) as 1 | 2 }
  return { ok: true, state: { ...state, grid, coins: state.coins - cost } }
}

/** Pièces gagnées pour une bonne réponse, compte tenu de la série en cours. */
export function quizReward(streakBefore: number): number {
  return QUIZ_COINS + (streakBefore + 1 >= STREAK_MIN ? STREAK_BONUS : 0)
}

/** Bonne réponse = pièces (+ bonus de série). Mauvaise = rien, la série repart à 0. */
export function answerQuiz(state: GameState, correct: boolean): GameState {
  if (!correct) return { ...state, quizTotal: state.quizTotal + 1, streak: 0 }
  return {
    ...state,
    quizTotal: state.quizTotal + 1,
    quizCorrect: state.quizCorrect + 1,
    streak: state.streak + 1,
    coins: state.coins + quizReward(state.streak),
  }
}

export function isTradeTurn(turn: number): boolean {
  return TRADE_TURNS_IN_LEVEL.includes(turnInLevel(turn))
}

/** Échanges proposables maintenant (pas encore utilisés, conditions remplies). */
export function availableTrades(state: GameState): TradeOffer[] {
  return TRADES.filter(
    (t) =>
      !state.usedTrades.includes(t.id) &&
      (!t.requires || state.grid.some((g) => g.family === t.requires!.family && g.tier >= t.requires!.tier)) &&
      (t.coins >= 0 || state.coins >= -t.coins),
  )
}

export function acceptTrade(state: GameState, offer: TradeOffer): GameState {
  if (state.coins + offer.coins < 0) return state
  const hasEffect = offer.effect.co2 !== 0 || offer.effect.capacity !== 0 || offer.effect.demand !== 0
  return {
    ...state,
    coins: state.coins + offer.coins,
    usedTrades: [...state.usedTrades, offer.id],
    modifiers: hasEffect
      ? [
          ...state.modifiers,
          {
            ...offer.effect,
            tradeId: offer.id,
            label: `${offer.emoji} ${offer.partner}`,
            untilLevel: offer.duration === 'level' ? state.level : null,
          },
        ]
      : state.modifiers,
  }
}

export function declineTrade(state: GameState, offer: TradeOffer): GameState {
  return { ...state, usedTrades: [...state.usedTrades, offer.id] }
}

export function computeStars(r: Omit<LevelResult, 'stars'>, target: number): number {
  return (r.demandMet ? 1 : 0) + (r.reductionPct >= target ? 1 : 0) + (r.satisfaction >= SATISFIED_THRESHOLD ? 1 : 0)
}

/** Fait tourner le data center un tour. Clôture le niveau tous les TURNS_PER_LEVEL tours. */
export function nextTurn(state: GameState): GameState {
  if (state.gameOver) return state
  const stats = computeStats(state)
  let satisfaction = state.satisfaction + (stats.demandMet ? SATISFACTION_UP : -SATISFACTION_DOWN)
  for (const tile of state.grid) satisfaction += FAMILIES[tile.family].tiers[tile.tier].satisfaction
  satisfaction = clamp(satisfaction, 0, 100)
  const coins = state.coins + stats.income + (stats.demandMet ? SERVICE_INCOME : 0)

  let next: GameState = { ...state, coins, satisfaction }
  const levelEnds = turnInLevel(state.turn) === TURNS_PER_LEVEL
  if (!levelEnds) return { ...next, turn: state.turn + 1 }

  const partial = { level: state.level, co2: stats.co2, reductionPct: stats.reductionPct, demandMet: stats.demandMet, satisfaction }
  const result: LevelResult = { ...partial, stars: computeStars(partial, LEVELS[state.level - 1].co2Target) }
  next = { ...next, levelResults: [...state.levelResults, result] }

  if (state.turn >= MAX_TURNS) return { ...next, gameOver: true }
  return {
    ...next,
    turn: state.turn + 1,
    level: state.level + 1,
    modifiers: state.modifiers.filter((m) => m.untilLevel === null || m.untilLevel > state.level),
  }
}
