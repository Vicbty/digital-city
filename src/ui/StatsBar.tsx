import { LEVELS } from '../engine/levels'
import { TURNS_PER_LEVEL, computeStats, turnInLevel } from '../engine/simulation'
import { useStore } from '../store'

export default function StatsBar() {
  const game = useStore((s) => s.game)
  const st = computeStats(game)
  const level = LEVELS[game.level - 1]
  const co2Pct = (st.co2 / game.startCo2) * 100
  const targetLeft = 100 - level.co2Target
  const capPct = st.demand > 0 ? Math.min(100, (st.capacity / st.demand) * 100) : 100

  return (
    <header className="stats">
      <div className="stats-row">
        <span>
          Niv. <strong>{game.level}</strong> · Tour <strong>{turnInLevel(game.turn)}</strong>/{TURNS_PER_LEVEL}
        </span>
        <span className="coins">
          🪙 <strong>{game.coins}</strong>
          {game.streak >= 2 && <small className="streak"> 🔥{game.streak}</small>}
        </span>
      </div>

      <div className="meter">
        <div className="meter-top">
          <span>🏭 CO₂</span>
          <strong>{st.co2}/tour</strong>
          <small className={st.reductionPct > 0 ? 'up' : 'muted'}>−{Math.max(0, st.reductionPct)} %</small>
          <small className="muted meter-goal">objectif −{level.co2Target} %</small>
        </div>
        <div className="meter-bar meter-bar-big">
          <div style={{ width: `${Math.min(100, co2Pct)}%`, background: co2Pct <= targetLeft ? 'var(--wellbeing)' : 'var(--danger)' }} />
          <i className="meter-target" style={{ left: `${targetLeft}%` }} />
        </div>
      </div>

      <div className="meters-2">
        <div className="meter">
          <div className="meter-top">
            <span>⚡</span>
            <strong className={st.demandMet ? '' : 'down'}>
              {st.capacity}/{st.demand}
            </strong>
            <small className="muted">capacité/demande</small>
          </div>
          <div className="meter-bar">
            <div style={{ width: `${capPct}%`, background: st.demandMet ? 'var(--privacy)' : 'var(--danger)' }} />
          </div>
        </div>
        <div className="meter">
          <div className="meter-top">
            <span>😊</span>
            <strong>{game.satisfaction}</strong>
            <small className="muted">habitants</small>
          </div>
          <div className="meter-bar">
            <div style={{ width: `${game.satisfaction}%`, background: 'var(--wellbeing)' }} />
          </div>
        </div>
      </div>
    </header>
  )
}
