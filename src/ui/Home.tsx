import { FAMILY_LIST } from '../engine/buildings'
import { LEVELS } from '../engine/levels'
import { PSEUDO_MAX, PSEUDO_MIN, cleanPseudo } from '../lib/pseudo'
import { useStore } from '../store'

export default function Home() {
  const start = useStore((s) => s.start)
  const pseudo = useStore((s) => s.pseudo)
  const setPseudo = useStore((s) => s.setPseudo)
  const valid = cleanPseudo(pseudo).length >= PSEUDO_MIN
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
      <form
        className="pseudo-form"
        onSubmit={(e) => {
          e.preventDefault()
          if (valid) start()
        }}
      >
        <label className="pseudo-field">
          Ton pseudo (pour le classement)
          <input
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            placeholder="ex. DataQueen"
            maxLength={PSEUDO_MAX}
            autoComplete="nickname"
            enterKeyHint="go"
          />
        </label>
        <button className="btn btn-primary btn-big" type="submit" disabled={!valid}>
          Jouer
        </button>
      </form>
    </main>
  )
}
