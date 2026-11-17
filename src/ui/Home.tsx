import { FAMILY_LIST } from '../engine/buildings'
import { LEVELS } from '../engine/levels'
import { useStore } from '../store'

export default function Home() {
  const start = useStore((s) => s.start)
  return (
    <main className="screen home">
      <div className="home-skyline" aria-hidden>
        {FAMILY_LIST.map((f) => (
          <span key={f.family}>{f.tiers[0].emoji}</span>
        ))}
      </div>
      <h1 className="title">Digital City</h1>
      <p className="tagline">
        Tu hérites du data center le plus polluant de France. Ta mission : le rendre le plus sobre possible… sans couper le service
        à tes utilisateurs.
      </p>
      <ul className="home-rules">
        <li>🧠 Réponds au quiz pour gagner des pièces 🪙</li>
        <li>🔧 Améliore tes installations, du pire au plus vert</li>
        <li>🤝 Négocie avec les data centers voisins</li>
        <li>⭐ {LEVELS.length} niveaux, 3 étoiles à chaque fois</li>
      </ul>
      <button className="btn btn-primary btn-big" onClick={start}>
        Jouer
      </button>
    </main>
  )
}
