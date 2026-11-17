import { PSEUDO_MAX, PSEUDO_MIN, cleanPseudo } from '../lib/pseudo'
import { useStore } from '../store'
import HowToPlay from './HowToPlay'
import Logo from './Logo'

export default function Home() {
  const start = useStore((s) => s.start)
  const pseudo = useStore((s) => s.pseudo)
  const setPseudo = useStore((s) => s.setPseudo)
  const valid = cleanPseudo(pseudo).length >= PSEUDO_MIN

  return (
    <main className="screen home">
      <div className="brand">
        <Logo size={64} />
        <div>
          <h1 className="title">Digital City</h1>
          <p className="tag">Data center DC-01 · à rénover</p>
        </div>
      </div>
      <p className="tagline">
        Tu hérites du data center le plus polluant de France. Rends-le sobre, sans couper le service à tes utilisateurs.
      </p>

      <section className="card">
        <h2 className="card-title">Comment gagner</h2>
        <HowToPlay />
      </section>

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
