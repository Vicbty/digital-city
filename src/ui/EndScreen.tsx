import { useEffect, useMemo, useRef, useState } from 'react'
import { CO2_MAX } from '../engine/simulation'
import { MONEY_REF, computeScore } from '../engine/score'
import type { GameState } from '../engine/types'
import { getPercentileBeaten, saveGame } from '../lib/supabase'
import { useStore } from '../store'

function verdict(g: GameState): string {
  const factors = [
    { k: 'money', v: Math.max(0, g.money) / MONEY_REF, msg: 'Ta ville est fauchée 💸 : il faut un peu de revenus pour construire.' },
    { k: 'co2', v: 1 - g.co2 / CO2_MAX, msg: 'Ta ville étouffe sous le CO₂ 🏭 : essaie les repair cafés et le data center vert.' },
    { k: 'wb', v: g.wellbeing / 100, msg: 'Tes habitants sont épuisés 😵 : un parc sans écran leur ferait du bien.' },
    { k: 'priv', v: g.privacy / 100, msg: 'Les données de tes habitants fuient partout 🕵️ : pense à l’école du numérique.' },
  ]
  const worst = factors.reduce((a, b) => (b.v < a.v ? b : a))
  if (worst.v >= 0.8) return 'Ville équilibrée, maire au top 🏆 !'
  return worst.msg
}

export default function EndScreen() {
  const game = useStore((s) => s.game)
  const start = useStore((s) => s.start)
  const showToast = useStore((s) => s.showToast)
  const score = useMemo(() => computeScore(game), [game])
  const [percentile, setPercentile] = useState<number | null | undefined>(undefined)
  const [rating, setRating] = useState<number | null>(null)
  const saved = useRef(false)

  useEffect(() => {
    let alive = true
    getPercentileBeaten(score).then((p) => alive && setPercentile(p))
    return () => {
      alive = false
    }
  }, [score])

  const save = (r: number | null) => {
    if (saved.current) return
    saved.current = true
    void saveGame({ score, quizCorrect: game.quizCorrect, quizTotal: game.quizTotal, rating: r })
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
    const text = `J'ai fait ${score}/100 à Digital City 🏙️ Tu peux faire mieux ?`
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
        <span>💰 {game.money}</span>
        <span>🏭 {game.co2}</span>
        <span>😊 {game.wellbeing}</span>
        <span>🔒 {game.privacy}</span>
        <span>🧠 {game.quizCorrect}/{game.quizTotal}</span>
      </div>

      <button className="btn btn-primary btn-big" onClick={share}>
        Défier mes potes 📤
      </button>

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
        Rejouer 🔁
      </button>
    </main>
  )
}
