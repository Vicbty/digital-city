import { useEffect, useState } from 'react'
import { getStats, isLocalMode, type Stats } from '../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    let alive = true
    const load = () => getStats().then((s) => alive && setStats(s))
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
        <h1 className="title-sm">🏙️ Digital City · Live</h1>
        {isLocalMode && <span className="badge">mode local</span>}
      </header>

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
    </main>
  )
}
