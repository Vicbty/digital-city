import { useEffect, useMemo, useRef, useState } from 'react'
import { LEVELS } from '../engine/levels'
import { computeScore, totalStars } from '../engine/score'
import type { GameState } from '../engine/types'
import { getLeaderboard, getPercentileBeaten, saveGame, type LeaderboardEntry } from '../lib/supabase'
import { useStore } from '../store'
import Leaderboard from './Leaderboard'

function verdict(g: GameState): string {
  const last = g.levelResults[g.levelResults.length - 1]
  if (!last) return ''
  if (!last.demandMet) return 'Ton data center est sobre… mais tes utilisateurs n’ont plus de service 😅 Garde assez de serveurs !'
  if (last.reductionPct >= 60) return 'Data center exemplaire 🌱 Les voisins viennent prendre des notes !'
  if (last.reductionPct >= 35) return 'Beau virage vert 💚 Prochaine fois, attaque l’énergie et la clim en premier.'
  return 'Ton data center fume encore 🏭 Astuce : chaque bonne réponse au quiz = des pièces pour l’améliorer.'
}

export default function EndScreen() {
  const game = useStore((s) => s.game)
  const pseudo = useStore((s) => s.pseudo)
  const [board, setBoard] = useState<LeaderboardEntry[] | null>(null)
  const start = useStore((s) => s.start)
  const showToast = useStore((s) => s.showToast)
  const score = useMemo(() => computeScore(game), [game])
  const stars = totalStars(game)
  const reduction = game.levelResults[game.levelResults.length - 1]?.reductionPct ?? 0
  const [percentile, setPercentile] = useState<number | null | undefined>(undefined)
  const [rating, setRating] = useState<number | null>(null)
  const saved = useRef(false)

  useEffect(() => {
    let alive = true
    getPercentileBeaten(score).then((p) => alive && setPercentile(p))
    getLeaderboard(10).then((b) => alive && setBoard(b))
    return () => {
      alive = false
    }
  }, [score])

  const save = (r: number | null) => {
    if (saved.current) return
    saved.current = true
    void saveGame({ score, quizCorrect: game.quizCorrect, quizTotal: game.quizTotal, rating: r, pseudo })
  }

  const rate = (r: number) => {
    if (saved.current) return
    setRating(r)
    save(r)
    showToast('Merci pour ta note ! 💜', 'ok')
  }

  const replay = () => {
    save(null)
    start()
  }

  const share = async () => {
    const url = window.location.origin
    const text = `J'ai rendu mon data center ${Math.max(0, reduction)} % moins polluant à Digital City (${score}/100) 🌱 Tu fais mieux ?`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Digital City', text, url })
        return
      }
      await navigator.clipboard.writeText(`${text} ${url}`)
      showToast('Lien copié ! Colle-le à tes potes 📋', 'ok')
    } catch (e) {
      if ((e as Error).name !== 'AbortError') showToast('Partage impossible, copie le lien à la main', 'error')
    }
  }

  // Le joueur est ajouté au classement affiché même avant l'enregistrement de sa partie.
  const merged = board ? [...board, { pseudo, score, me: true }].sort((a, b) => b.score - a.score) : []
  const myIndex = merged.findIndex((e) => 'me' in e)
  const top = merged.slice(0, 5)

  return (
    <main className="screen end">
      <p className="end-label">Ton score</p>
      <p className="end-score">
        {score}
        <span>/100</span>
      </p>
      <p className="end-percentile">
        {percentile === undefined
          ? '…'
          : percentile === null
            ? 'Tu fais partie des tout premiers joueurs 🚀'
            : `Tu bats ${percentile} % des joueurs !`}
      </p>
      <p className="end-verdict">{verdict(game)}</p>

      <div className="end-recap">
        <span>
          ⭐ {stars}/{LEVELS.length * 3}
        </span>
        <span>🏭 CO₂ −{Math.max(0, reduction)} %</span>
        <span>😊 {game.satisfaction}</span>
        <span>
          🧠 {game.quizCorrect}/{game.quizTotal}
        </span>
      </div>

      <button className="btn btn-primary btn-big" onClick={share}>
        Défier mes potes
      </button>

      {board && <Leaderboard entries={top} extra={myIndex >= 5 ? { pseudo, score } : null} />}

      <section className="rating">
        <p>{rating ? `Tu as mis ${rating}/10, merci !` : 'Tu notes le jeu combien ?'}</p>
        <div className="rating-grid">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`rate ${rating === n ? 'rate-on' : ''}`}
              disabled={rating !== null}
              onClick={() => rate(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </section>

      <button className="btn btn-ghost" onClick={replay}>
        Rejouer
      </button>
    </main>
  )
}
