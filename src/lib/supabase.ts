import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Si les clés manquent, tout fonctionne en localStorage (mode local).
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

let client: SupabaseClient | null = null
try {
  client = url && key ? createClient(url, key) : null
} catch (e) {
  console.error('[supabase] init', e)
  client = null
}

export const isLocalMode = client === null

export interface GameRecord {
  score: number
  quizCorrect: number
  quizTotal: number
  rating: number | null // 1-10, null si le joueur n'a pas noté
  pseudo?: string | null
}

export interface LeaderboardEntry {
  pseudo: string
  score: number
}

export interface Stats {
  visitors: number
  games: number
  avgQuizPercent: number // 0-100
  avgRating: number // 0 si aucune note
  ratingDistribution: number[] // index 0 = note 1 … index 9 = note 10
  scores: number[]
}

const LS_VISIT_DAY = 'dc_visit_day'
const LS_VISITS = 'dc_local_visits'
const LS_GAMES = 'dc_local_games'

function lsGet<T>(k: string, fallback: T): T {
  try {
    const v = localStorage.getItem(k)
    return v ? (JSON.parse(v) as T) : fallback
  } catch {
    return fallback
  }
}
function lsSet(k: string, v: unknown) {
  try {
    localStorage.setItem(k, JSON.stringify(v))
  } catch {
    /* stockage indisponible : on ignore */
  }
}

/** 1 visite par navigateur et par jour. */
export async function logVisit(): Promise<void> {
  const today = new Date().toISOString().slice(0, 10)
  if (lsGet<string | null>(LS_VISIT_DAY, null) === today) return
  lsSet(LS_VISIT_DAY, today)
  if (!client) {
    lsSet(LS_VISITS, lsGet<number>(LS_VISITS, 0) + 1)
    return
  }
  try {
    const { error } = await client.from('visits').insert({})
    if (error) throw error
  } catch (e) {
    console.error('[supabase] logVisit', e)
  }
}

export async function saveGame(game: GameRecord): Promise<void> {
  if (!client) {
    lsSet(LS_GAMES, [...lsGet<GameRecord[]>(LS_GAMES, []), game])
    return
  }
  const row = {
    score: game.score,
    quiz_correct: game.quizCorrect,
    quiz_total: game.quizTotal,
    rating: game.rating,
  }
  try {
    const { error } = await client.from('games').insert({ ...row, pseudo: game.pseudo ?? null })
    if (!error) return
    // Colonne pseudo pas encore créée dans Supabase : on enregistre quand même la partie, sans pseudo.
    console.error('[supabase] saveGame (avec pseudo)', error)
    const retry = await client.from('games').insert(row)
    if (retry.error) throw retry.error
  } catch (e) {
    console.error('[supabase] saveGame', e)
  }
}

/** Meilleurs scores avec pseudo, du plus haut au plus bas. */
export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  if (!client) {
    return lsGet<GameRecord[]>(LS_GAMES, [])
      .filter((g): g is GameRecord & { pseudo: string } => !!g.pseudo)
      .map((g) => ({ pseudo: g.pseudo, score: g.score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }
  try {
    const { data, error } = await client
      .from('games')
      .select('pseudo, score')
      .not('pseudo', 'is', null)
      .order('score', { ascending: false })
      .limit(limit)
    if (error) throw error
    return (data ?? []).map((r) => ({ pseudo: String(r.pseudo), score: r.score ?? 0 }))
  } catch (e) {
    console.error('[supabase] getLeaderboard', e)
    return []
  }
}

async function fetchGames(): Promise<GameRecord[]> {
  if (!client) return lsGet<GameRecord[]>(LS_GAMES, [])
  try {
    const { data, error } = await client
      .from('games')
      .select('score, quiz_correct, quiz_total, rating')
      .limit(10000)
    if (error) throw error
    return (data ?? []).map((r) => ({
      score: r.score ?? 0,
      quizCorrect: r.quiz_correct ?? 0,
      quizTotal: r.quiz_total ?? 0,
      rating: r.rating ?? null,
    }))
  } catch (e) {
    console.error('[supabase] fetchGames', e)
    return []
  }
}

async function fetchVisitors(): Promise<number> {
  if (!client) return lsGet<number>(LS_VISITS, 0)
  try {
    const { count, error } = await client.from('visits').select('*', { count: 'exact', head: true })
    if (error) throw error
    return count ?? 0
  } catch (e) {
    console.error('[supabase] fetchVisitors', e)
    return 0
  }
}

export async function getStats(): Promise<Stats> {
  const [visitors, games] = await Promise.all([fetchVisitors(), fetchGames()])
  const quizTotal = games.reduce((s, g) => s + g.quizTotal, 0)
  const quizCorrect = games.reduce((s, g) => s + g.quizCorrect, 0)
  const ratings = games.map((g) => g.rating).filter((r): r is number => r !== null && r >= 1 && r <= 10)
  const ratingDistribution = Array(10).fill(0) as number[]
  ratings.forEach((r) => ratingDistribution[r - 1]++)
  return {
    visitors,
    games: games.length,
    avgQuizPercent: quizTotal ? Math.round((quizCorrect / quizTotal) * 100) : 0,
    avgRating: ratings.length ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : 0,
    ratingDistribution,
    scores: games.map((g) => g.score),
  }
}

/** % des parties avec un score strictement inférieur. null s'il n'y a encore aucune partie. */
export async function getPercentileBeaten(score: number): Promise<number | null> {
  const scores = (await fetchGames()).map((g) => g.score)
  if (scores.length === 0) return null
  return Math.round((scores.filter((s) => s < score).length / scores.length) * 100)
}
