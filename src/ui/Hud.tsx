import { LEVELS } from '../engine/levels'
import { TURNS_PER_LEVEL, computeStats, turnInLevel } from '../engine/simulation'
import { useStore } from '../store'

/** Bandeau du haut : niveau, pièces, mission en cours, service et satisfaction. */
export default function Hud() {
  const game = useStore((s) => s.game)
  const setShowHelp = useStore((s) => s.setShowHelp)
  const st = computeStats(game)
  const level = LEVELS[game.level - 1]
  const reduction = Math.max(0, st.reductionPct)
  const progress = Math.min(100, (reduction / level.co2Target) * 100)
  const reached = reduction >= level.co2Target

  return (
    <header className="hud">
      <div className="hud-row">
        <span className="tag">
          Niv. {game.level} · tour {turnInLevel(game.turn)}/{TURNS_PER_LEVEL}
        </span>
        <span className="coins">
          🪙 <strong>{game.coins}</strong>
          {game.streak >= 2 && <small className="streak"> 🔥×{game.streak}</small>}
        </span>
        <button className="help-btn" onClick={() => setShowHelp(true)} aria-label="Comment jouer">
          ?
        </button>
      </div>

      <div className="mission">
        <div className="mission-top">
          <span>
            Objectif : <strong>CO₂ −{level.co2Target} %</strong>
          </span>
          <span className={reached ? 'up' : ''}>
            {reached ? 'Atteint ✓' : `tu es à −${reduction} %`}
          </span>
        </div>
        <div className="bar">
          <div style={{ width: `${progress}%` }} className={reached ? 'bar-ok' : 'bar-run'} />
        </div>
      </div>

      <div className="hud-row hud-small">
        <span className={st.demandMet ? '' : 'down'}>
          {st.demandMet ? 'Service OK' : 'Saturé !'} · ⚡ {st.capacity}/{st.demand}
        </span>
        <span>
          Satisf. <strong className={game.satisfaction >= 70 ? 'up' : game.satisfaction < 40 ? 'down' : ''}>{game.satisfaction}</strong>
          /100
        </span>
      </div>
    </header>
  )
}
