import { BUILDINGS } from './buildings'
import type { BonusType, BuildingType, GameState, PlaceResult, TurnDelta } from './types'

export const GRID_SIZE = 10
export const MAX_TURNS = 15
export const CO2_MAX = 500
export const QUIZ_BONUS: Record<BonusType, number> = { money: 50, wellbeing: 3, privacy: 3 }

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function createInitialState(): GameState {
  return {
    grid: Array(GRID_SIZE * GRID_SIZE).fill(null),
    money: 1000,
    co2: 0,
    wellbeing: 70,
    privacy: 70,
    turn: 1,
    quizCorrect: 0,
    quizTotal: 0,
    gameOver: false,
  }
}

export function placeBuilding(state: GameState, index: number, type: BuildingType): PlaceResult {
  if (state.gameOver) return { ok: false, error: 'gameOver', state }
  if (index < 0 || index >= state.grid.length) return { ok: false, error: 'outOfBounds', state }
  if (state.grid[index] !== null) return { ok: false, error: 'occupied', state }
  const { cost } = BUILDINGS[type]
  if (state.money < cost) return { ok: false, error: 'notEnoughMoney', state }
  const grid = state.grid.slice()
  grid[index] = type
  return { ok: true, state: { ...state, grid, money: state.money - cost } }
}

/** Ce que la ville produira au prochain tour (somme des bâtiments). */
export function computeTurnDelta(state: GameState): TurnDelta {
  const delta: TurnDelta = { money: 0, co2: 0, wellbeing: 0, privacy: 0 }
  for (const cell of state.grid) {
    if (!cell) continue
    const b = BUILDINGS[cell]
    delta.money += b.income
    delta.co2 += b.co2
    delta.wellbeing += b.wellbeing
    delta.privacy += b.privacy
  }
  return delta
}

/** Applique la réponse au quiz du tour. Bonne réponse = bonus, mauvaise = rien. */
export function answerQuiz(state: GameState, correct: boolean, bonus: BonusType): GameState {
  const next = { ...state, quizTotal: state.quizTotal + 1 }
  if (!correct) return next
  next.quizCorrect = state.quizCorrect + 1
  const amount = QUIZ_BONUS[bonus]
  if (bonus === 'money') next.money = state.money + amount
  if (bonus === 'wellbeing') next.wellbeing = clamp(state.wellbeing + amount, 0, 100)
  if (bonus === 'privacy') next.privacy = clamp(state.privacy + amount, 0, 100)
  return next
}

/** Fait produire la ville et passe au tour suivant. Fin de partie après le tour MAX_TURNS. */
export function nextTurn(state: GameState): GameState {
  if (state.gameOver) return state
  const d = computeTurnDelta(state)
  const isLast = state.turn >= MAX_TURNS
  return {
    ...state,
    money: state.money + d.money,
    co2: Math.max(0, state.co2 + d.co2),
    wellbeing: clamp(state.wellbeing + d.wellbeing, 0, 100),
    privacy: clamp(state.privacy + d.privacy, 0, 100),
    turn: isLast ? state.turn : state.turn + 1,
    gameOver: isLast,
  }
}
