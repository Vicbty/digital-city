import { create } from 'zustand'
import questionsData from './content/questions.json'
import { BUILDINGS } from './engine/buildings'
import { answerQuiz, createInitialState, nextTurn, placeBuilding } from './engine/simulation'
import type { BuildingType, GameState, PlaceError, Question } from './engine/types'

const QUESTIONS = questionsData as Question[]

export type Screen = 'home' | 'game' | 'end'
export type ToastKind = 'ok' | 'error' | 'info'

interface Toast {
  id: number
  text: string
  kind: ToastKind
}

interface Store {
  screen: Screen
  game: GameState
  selected: BuildingType | null
  questions: Question[] // file mélangée, sans répétition
  currentQuiz: Question | null
  toast: Toast | null
  flash: { index: number; kind: 'ok' | 'error'; id: number } | null

  start: () => void
  select: (type: BuildingType) => void
  tapCell: (index: number) => void
  openQuiz: () => void
  finishQuiz: (correct: boolean) => void
  showToast: (text: string, kind?: ToastKind) => void
  goHome: () => void
}

/** Mélange en évitant deux thèmes identiques à la suite quand c'est possible. */
function shuffleQuestions(list: Question[]): Question[] {
  const pool = [...list].sort(() => Math.random() - 0.5)
  const out: Question[] = []
  while (pool.length) {
    const prev = out[out.length - 1]
    let i = pool.findIndex((q) => q.theme !== prev?.theme)
    if (i === -1) i = 0
    out.push(pool.splice(i, 1)[0])
  }
  return out
}

const ERROR_TEXT: Record<PlaceError, string> = {
  occupied: 'Case déjà occupée !',
  notEnoughMoney: "Pas assez d'argent 💸",
  outOfBounds: 'Hors de la ville',
  gameOver: 'La partie est finie',
}

let counter = 0

export const useStore = create<Store>((set, get) => ({
  screen: 'home',
  game: createInitialState(),
  selected: null,
  questions: [],
  currentQuiz: null,
  toast: null,
  flash: null,

  start: () =>
    set({
      screen: 'game',
      game: createInitialState(),
      selected: null,
      questions: shuffleQuestions(QUESTIONS),
      currentQuiz: null,
      toast: null,
      flash: null,
    }),

  select: (type) => set({ selected: get().selected === type ? null : type }),

  tapCell: (index) => {
    const { selected, game, showToast } = get()
    if (!selected) {
      if (game.grid[index]) {
        const b = BUILDINGS[game.grid[index]!]
        showToast(`${b.emoji} ${b.name}`, 'info')
      } else {
        showToast('Choisis un bâtiment en bas 👇', 'info')
      }
      return
    }
    const res = placeBuilding(game, index, selected)
    if (res.ok) {
      set({ game: res.state, flash: { index, kind: 'ok', id: ++counter } })
      showToast(`${BUILDINGS[selected].emoji} construit ! −${BUILDINGS[selected].cost} 💰`, 'ok')
    } else {
      set({ flash: { index, kind: 'error', id: ++counter } })
      showToast(ERROR_TEXT[res.error], 'error')
    }
  },

  openQuiz: () => {
    const { questions, game } = get()
    const q = questions[(game.turn - 1) % questions.length] ?? null
    set({ currentQuiz: q, selected: null, toast: null })
  },

  finishQuiz: (correct) => {
    const { game, currentQuiz } = get()
    if (!currentQuiz) return
    const next = nextTurn(answerQuiz(game, correct, currentQuiz.bonus))
    set({ game: next, currentQuiz: null, screen: next.gameOver ? 'end' : 'game' })
  },

  showToast: (text, kind = 'info') => set({ toast: { id: ++counter, text, kind } }),

  goHome: () => set({ screen: 'home', currentQuiz: null }),
}))
