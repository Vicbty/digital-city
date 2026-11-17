import { BUILDING_LIST } from '../engine/buildings'
import { MAX_TURNS } from '../engine/simulation'
import { useStore } from '../store'

export default function Home() {
  const start = useStore((s) => s.start)
  return (
    <main className="screen home">
      <div className="home-skyline" aria-hidden>
        {BUILDING_LIST.map((b) => (
          <span key={b.type}>{b.emoji}</span>
        ))}
      </div>
      <h1 className="title">Digital City</h1>
      <p className="tagline">
        Tu es maire d'une ville connectée. Rends-la rentable… sans cramer la planète ni le cerveau de tes habitants.
      </p>
      <ul className="home-rules">
        <li>🏗️ Construis sur la grille</li>
        <li>🧠 Réponds à une question à chaque tour</li>
        <li>🏁 {MAX_TURNS} tours pour faire le meilleur score</li>
      </ul>
      <button className="btn btn-primary btn-big" onClick={start}>
        Jouer
      </button>
    </main>
  )
}
