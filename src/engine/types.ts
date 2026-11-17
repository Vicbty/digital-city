// CONTRAT partagé entre le moteur et l'interface.
// Ne pas modifier sans prévenir (cf. CLAUDE.md).

export type BuildingType =
  | 'datacenter'
  | 'greenDatacenter'
  | 'antenna'
  | 'socialNetwork'
  | 'repairCafe'
  | 'digitalSchool'
  | 'screenFreePark'

export interface BuildingStats {
  type: BuildingType
  name: string // nom affiché (FR)
  emoji: string
  description: string // une phrase courte (FR)
  cost: number
  income: number // argent par tour
  co2: number // CO₂ par tour
  wellbeing: number // bien-être par tour
  privacy: number // données / vie privée par tour
}

/** Case de la grille : null = vide */
export type Cell = BuildingType | null

export type BonusType = 'money' | 'wellbeing' | 'privacy'

export type QuizTheme =
  | 'empreinte'
  | 'reseaux-sociaux'
  | 'donnees-perso'
  | 'cybersecurite'
  | 'sante-mentale'
  | 'fake-news'
  | 'materiel'

export interface Question {
  id: string
  theme: QuizTheme
  question: string
  choices: string[]
  answer: number
  explication: string
  source: string
  bonus: BonusType
}

export interface GameState {
  grid: Cell[] // GRID_SIZE * GRID_SIZE cases, index = y * GRID_SIZE + x
  money: number
  co2: number
  wellbeing: number // 0-100
  privacy: number // 0-100
  turn: number // 1..MAX_TURNS
  quizCorrect: number
  quizTotal: number
  gameOver: boolean
}

export type PlaceError = 'occupied' | 'notEnoughMoney' | 'outOfBounds' | 'gameOver'

export type PlaceResult =
  | { ok: true; state: GameState }
  | { ok: false; error: PlaceError; state: GameState }

/** Variation des indicateurs sur un tour (pour l'affichage). */
export interface TurnDelta {
  money: number
  co2: number
  wellbeing: number
  privacy: number
}
