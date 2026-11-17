import { useEffect, useState } from 'react'
import { getLeaderboard, getStats, isLocalMode, type LeaderboardEntry, type Stats } from '../lib/supabase'
import Leaderboard from './Leaderboard'
import Logo from './Logo'
import QrModal from './QrModal'

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [showQr, setShowQr] = useState(false)
  const [board, setBoard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    let alive = true
    const load = () => {
      getStats().then((s) => alive && setStats(s))
      getLeaderboard(10).then((b) => alive && setBoard(b))
    }
    load()
    const id = setInterval(load, 10_000)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  const maxCount = stats ? Math.max(1, ...stats.ratingDistribution) : 1

  return (
    <main className="screen dashboard">
      <header className="dash-head">
        <Logo size={36} />
        <h1 className="title-sm">EcoVille Digital · en direct</h1>
        {isLocalMode && <span className="badge">mode local</span>}
      </header>

      <button className="btn btn-primary" onClick={() => setShowQr(true)}>
        QR code pour jouer
      </button>

      {!stats ? (
        <p className="muted">Chargement…</p>
      ) : (
        <>
          <div className="tiles">
            <div className="tile">
              <strong>{stats.visitors}</strong>
              <span>visiteurs</span>
            </div>
            <div className="tile">
              <strong>{stats.games}</strong>
              <span>parties jouées</span>
            </div>
            <div className="tile">
              <strong>{stats.avgQuizPercent} %</strong>
              <span>bonnes réponses au quiz</span>
            </div>
            <div className="tile">
              <strong>{stats.avgRating ? `${stats.avgRating}/10` : '–'}</strong>
              <span>note moyenne</span>
            </div>
          </div>

          <Leaderboard entries={board} title="Top 10 des joueurs" />

          <section className="dist">
            <h2>Répartition des notes</h2>
            <div className="dist-bars">
              {stats.ratingDistribution.map((count, i) => (
                <div key={i} className="dist-col">
                  <small>{count || ''}</small>
                  <div className="dist-bar" style={{ height: `${(count / maxCount) * 100}%` }} />
                  <span>{i + 1}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <p className="muted small">Mise à jour automatique toutes les 10 s</p>
      <a className="btn btn-ghost" href="/">
        ← Retour au jeu
      </a>
      {showQr && <QrModal onClose={() => setShowQr(false)} />}
    </main>
  )
}
