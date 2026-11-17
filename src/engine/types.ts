// CONTRAT partagé entre le moteur et l'interface.
// Ne pas modifier sans prévenir (cf. CLAUDE.md).

/** Les 5 familles d'installations du data center. */
export type Family = 'servers' | 'cooling' | 'energy' | 'storage' | 'hardware'

/** 0 = version la plus polluante, 2 = version la plus sobre. */
export type Tier = 0 | 1 | 2

export interface TierStats {
  name: string // nom affiché (FR)
  emoji: string
  description: string // une phrase courte (FR)
  co2: number // CO₂ émis par tour
  capacity: number // puissance de calcul fournie
  demand: number // charge ajoutée (ex. données zombies)
  income: number // pièces gagnées par tour
  satisfaction: number // effet sur la satisfaction des habitants par tour
}

export interface FamilyDef {
  family: Family
  label: string // nom de la famille (FR)
  upgradeCosts: [number, number] // prix pour passer au niveau 1, puis au niveau 2
  tiers: [TierStats, TierStats, TierStats]
}

export interface Tile {
  family: Family
  tier: Tier
}

/** Effet chiffré (bâtiment, échange…). */
export interface Effect {
  co2: number
  capacity: number
  demand: number
}

/** Effet d'un échange accepté, actif jusqu'à la fin d'un niveau ou pour toujours. */
export interface Modifier extends Effect {
  tradeId: string
  label: string
  untilLevel: number | null // null = permanent
}

export interface TradeOffer {
  id: string
  partner: string
  emoji: string
  text: string
  coins: number // >0 tu gagnes, <0 tu paies
  effect: Effect
  duration: 'level' | 'permanent'
  requires?: { family: Family; tier: Tier } // au moins une tuile de cette famille à ce niveau
}

export interface LevelDef {
  level: number
  name: string
  intro: string
  baseDemand: number
  co2Target: number // réduction de CO₂ visée, en % (ex. 20 = −20 %)
}

export interface LevelResult {
  level: number
  co2: number
  reductionPct: number
  demandMet: boolean
  satisfaction: number
  stars: number // 0 à 3
}

export type QuizTheme = 'energie' | 'refroidissement' | 'materiel' | 'donnees' | 'usages' | 'ia' | 'reseau'

export interface Question {
  id: string
  theme: QuizTheme
  question: string
  choices: string[]
  answer: number
  explication: string
  source: string
}

export interface GameState {
  grid: Tile[]
  coins: number
  satisfaction: number // 0-100
  turn: number // 1..MAX_TURNS
  level: number // 1..LEVELS.length
  startCo2: number // CO₂/tour au départ (référence pour les réductions)
  modifiers: Modifier[]
  usedTrades: string[]
  quizCorrect: number
  quizTotal: number
  streak: number // bonnes réponses d'affilée
  levelResults: LevelResult[]
  gameOver: boolean
}

export type UpgradeError = 'maxTier' | 'notEnoughCoins' | 'outOfBounds' | 'gameOver'

export type UpgradeResult =
  | { ok: true; state: GameState }
  | { ok: false; error: UpgradeError; state: GameState }

/** État calculé du data center à un instant donné. */
export interface CityStats {
  co2: number
  capacity: number
  demand: number
  income: number
  reductionPct: number
  demandMet: boolean
}
