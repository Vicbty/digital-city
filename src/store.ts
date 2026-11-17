import { create } from 'zustand'
import questionsData from './content/questions.json'
import { FAMILIES } from './engine/buildings'
import {
  acceptTrade,
  answerQuiz,
  availableTrades,
  createInitialState,
  declineTrade,
  isTradeTurn,
  nextTurn,
  upgradeTile,
} from './engine/simulation'
import type { Family, GameState, LevelResult, Question, TradeOffer, UpgradeError } from './engine/types'
import { cleanPseudo, loadPseudo, storePseudo } from './lib/pseudo'

const QUESTIONS = questionsData as Question[]

export type Screen = 'home' | 'game' | 'end'
export type Phase = 'build' | 'quiz' | 'trade' | 'level'
export type ToastKind = 'ok' | 'error' | 'info'
/** Ce que le joueur regarde : l'extérieur du bâtiment, le plan des zones, ou une zone. */
export type View = 'outside' | 'plan' | Family

interface Toast {
  id: number
  text: string
  kind: ToastKind
}

/** Carte de niveau : résultat du niveau terminé (si besoin) + présentation du suivant. */
export interface LevelCardData {
  result: LevelResult | null
  nextLevel: number | null
}

interface Store {
  screen: Screen
  pseudo: string
  phase: Phase
  game: GameState
  view: View
  showHelp: boolean
  questions: Question[]
  currentQuiz: Question | null
  currentTrade: TradeOffer | null
  levelCard: LevelCardData | null
  toast: Toast | null
  flash: { index: number; kind: 'ok' | 'error'; id: number } | null

  setPseudo: (raw: string) => void
  start: () => void
  setView: (view: View) => void
  setShowHelp: (show: boolean) => void
  upgrade: (index: number) => void
  openQuiz: () => void
  finishQuiz: (correct: boolean) => void
  resolveTrade: (accept: boolean) => void
  closeLevelCard: () => void
  showToast: (text: string, kind?: ToastKind) => void
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

const ERROR_TEXT: Record<UpgradeError, string> = {
  maxTier: 'Déjà la version la plus sobre',
  notEnoughCoins: 'Pas assez de pièces : réponds juste au quiz pour en gagner',
  outOfBounds: 'Hors du data center',
  gameOver: 'La partie est finie',
}

let counter = 0

export const useStore = create<Store>((set, get) => {
  /** Fait tourner le tour et affiche la carte de niveau si un niveau vient de se terminer. */
  const endTurn = (game: GameState) => {
    const next = nextTurn(game)
    const levelDone = next.levelResults.length > game.levelResults.length
    if (!levelDone) {
      set({ game: next, phase: 'build', currentQuiz: null, currentTrade: null })
      return
    }
    set({
      game: next,
      phase: 'level',
      currentQuiz: null,
      currentTrade: null,
      levelCard: { result: next.levelResults[next.levelResults.length - 1], nextLevel: next.gameOver ? null : next.level },
    })
  }

  return {
    screen: 'home',
    pseudo: loadPseudo(),
    phase: 'build',
    game: createInitialState(),
    view: 'outside',
    showHelp: false,
    questions: [],
    currentQuiz: null,
    currentTrade: null,
    levelCard: null,
    toast: null,
    flash: null,

    setPseudo: (raw) => set({ pseudo: raw.slice(0, 20) }),

    start: () => {
      const pseudo = cleanPseudo(get().pseudo)
      storePseudo(pseudo)
      set({
        pseudo,
        screen: 'game',
        phase: 'level',
        game: createInitialState(),
        view: 'outside',
        showHelp: false,
        questions: shuffleQuestions(QUESTIONS),
        currentQuiz: null,
        currentTrade: null,
        levelCard: { result: null, nextLevel: 1 },
        toast: null,
        flash: null,
      })
    },

    setView: (view) => set({ view }),

    setShowHelp: (showHelp) => set({ showHelp }),

    upgrade: (index) => {
      const { game, showToast } = get()
      const before = game.grid[index]
      const res = upgradeTile(game, index)
      if (res.ok) {
        const after = FAMILIES[before.family].tiers[before.tier + 1]
        set({ game: res.state, flash: { index, kind: 'ok', id: ++counter } })
        showToast(`${after.emoji} ${after.name} installé !`, 'ok')
      } else {
        set({ flash: { index, kind: 'error', id: ++counter } })
        showToast(ERROR_TEXT[res.error], 'error')
      }
    },

    openQuiz: () => {
      const { questions, game } = get()
      const q = questions[(game.turn - 1) % questions.length] ?? null
      set({ currentQuiz: q, phase: 'quiz', toast: null })
    },

    finishQuiz: (correct) => {
      const { game } = get()
      const answered = answerQuiz(game, correct)
      if (isTradeTurn(answered.turn)) {
        const offers = availableTrades(answered)
        if (offers.length) {
          const offer = offers[Math.floor(Math.random() * offers.length)]
          set({ game: answered, currentQuiz: null, currentTrade: offer, phase: 'trade' })
          return
        }
      }
      endTurn(answered)
    },

    resolveTrade: (accept) => {
      const { game, currentTrade } = get()
      if (!currentTrade) return
      endTurn(accept ? acceptTrade(game, currentTrade) : declineTrade(game, currentTrade))
    },

    closeLevelCard: () => {
      const { game } = get()
      set({ levelCard: null, phase: 'build', view: 'outside', screen: game.gameOver ? 'end' : 'game' })
    },

    showToast: (text, kind = 'info') => set({ toast: { id: ++counter, text, kind } }),
  }
})
