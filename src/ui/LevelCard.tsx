import { LEVELS } from '../engine/levels'
import { SATISFIED_THRESHOLD } from '../engine/simulation'
import type { LevelCardData } from '../store'
import { useStore } from '../store'

function Stars({ n }: { n: number }) {
  return (
    <p className="stars" aria-label={`${n} étoiles sur 3`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={i < n ? 'star-on' : 'star-off'}>
          ★
        </span>
      ))}
    </p>
  )
}

export default function LevelCard({ data }: { data: LevelCardData }) {
  const close = useStore((s) => s.closeLevelCard)
  const { result, nextLevel } = data
  const done = result ? LEVELS[result.level - 1] : null
  const next = nextLevel ? LEVELS[nextLevel - 1] : null

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="quiz level-card">
        {result && done && (
          <section>
            <p className="quiz-meta">Niveau {result.level} terminé</p>
            <Stars n={result.stars} />
            <ul className="criteria">
              <li className={result.demandMet ? 'up' : 'down'}>{result.demandMet ? '✔' : '✘'} Demande couverte</li>
              <li className={result.reductionPct >= done.co2Target ? 'up' : 'down'}>
                {result.reductionPct >= done.co2Target ? '✔' : '✘'} CO₂ −{Math.max(0, result.reductionPct)} % (objectif −{done.co2Target} %)
              </li>
              <li className={result.satisfaction >= SATISFIED_THRESHOLD ? 'up' : 'down'}>
                {result.satisfaction >= SATISFIED_THRESHOLD ? '✔' : '✘'} Habitants satisfaits ({result.satisfaction}/100)
              </li>
            </ul>
          </section>
        )}
        {next && (
          <section className={result ? 'level-next' : ''}>
            <p className="quiz-meta">Niveau {next.level}</p>
            <h2 className="quiz-question">{next.name}</h2>
            <p>{next.intro}</p>
            <p className="muted small">
              🎯 Objectif : CO₂ −{next.co2Target} % · demande à couvrir ⚡ {next.baseDemand}+
            </p>
          </section>
        )}
        <button className="btn btn-primary btn-big" onClick={close}>
          {next ? 'C’est parti ➜' : 'Voir mon score 🏆'}
        </button>
      </div>
    </div>
  )
}
