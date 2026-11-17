import { CO2_MAX, MAX_TURNS, computeTurnDelta } from '../engine/simulation'
import { computeScore } from '../engine/score'
import { useStore } from '../store'

function fmt(n: number) {
  return (n > 0 ? '+' : '') + n
}

interface MeterProps {
  emoji: string
  label: string
  value: string
  delta: number
  percent: number
  color: string
  invert?: boolean // true si une hausse est mauvaise (CO₂)
}

function Meter({ emoji, label, value, delta, percent, color, invert }: MeterProps) {
  const good = invert ? delta < 0 : delta > 0
  const bad = invert ? delta > 0 : delta < 0
  return (
    <div className="meter" aria-label={label}>
      <div className="meter-top">
        <span>{emoji}</span>
        <strong>{value}</strong>
        {delta !== 0 && <small className={good ? 'up' : bad ? 'down' : ''}>{fmt(delta)}</small>}
      </div>
      <div className="meter-bar">
        <div style={{ width: `${Math.max(0, Math.min(100, percent))}%`, background: color }} />
      </div>
    </div>
  )
}

export default function StatsBar() {
  const game = useStore((s) => s.game)
  const d = computeTurnDelta(game)
  return (
    <header className="stats">
      <div className="stats-row">
        <span className="turn">
          Tour <strong>{game.turn}</strong>/{MAX_TURNS}
        </span>
        <span className="live-score">
          Score <strong>{computeScore(game)}</strong>/100
        </span>
      </div>
      <div className="meters">
        <Meter emoji="💰" label="Argent" value={String(game.money)} delta={d.money} percent={(game.money / 3000) * 100} color="var(--money)" />
        <Meter emoji="🏭" label="CO₂" value={`${game.co2}/${CO2_MAX}`} delta={d.co2} percent={(game.co2 / CO2_MAX) * 100} color={game.co2 > CO2_MAX * 0.7 ? 'var(--danger)' : 'var(--co2)'} invert />
        <Meter emoji="😊" label="Bien-être" value={String(game.wellbeing)} delta={d.wellbeing} percent={game.wellbeing} color="var(--wellbeing)" />
        <Meter emoji="🔒" label="Données" value={String(game.privacy)} delta={d.privacy} percent={game.privacy} color="var(--privacy)" />
      </div>
    </header>
  )
}
