import { FAMILIES } from '../engine/buildings'
import { upgradeCost } from '../engine/simulation'
import { useStore } from '../store'

function Chip({ label, good }: { label: string; good: boolean }) {
  return <span className={`chip ${good ? 'chip-good' : 'chip-bad'}`}>{label}</span>
}

export default function UpgradePanel() {
  const game = useStore((s) => s.game)
  const selected = useStore((s) => s.selectedTile)
  const upgrade = useStore((s) => s.upgradeSelected)

  if (selected === null) {
    return (
      <div className="panel">
        <p className="hint">👆 Touche une installation pour l’améliorer.</p>
        {game.modifiers.length > 0 && (
          <div className="chips">
            {game.modifiers.map((m) => (
              <span key={m.tradeId} className="chip">
                {m.label}
                {m.untilLevel !== null ? ' (ce niveau)' : ''}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  const tile = game.grid[selected]
  const fam = FAMILIES[tile.family]
  const cur = fam.tiers[tile.tier]
  const cost = upgradeCost(game, selected)

  if (cost === null) {
    return (
      <div className="panel">
        <p className="panel-title">
          {cur.emoji} <strong>{cur.name}</strong> · niveau max 🌱
        </p>
        <p className="hint">{cur.description}</p>
      </div>
    )
  }

  const next = fam.tiers[tile.tier + 1]
  const chips: { label: string; good: boolean }[] = []
  if (next.co2 !== cur.co2) chips.push({ label: `🏭 ${next.co2 - cur.co2}/tour`, good: next.co2 < cur.co2 })
  if (next.capacity !== cur.capacity) chips.push({ label: `⚡ +${next.capacity - cur.capacity}`, good: true })
  if (next.demand !== cur.demand) chips.push({ label: `📉 demande ${next.demand - cur.demand}`, good: true })
  if (next.income !== cur.income) chips.push({ label: `🪙 +${next.income}/tour`, good: true })
  if (next.satisfaction !== cur.satisfaction) chips.push({ label: `😊 +${next.satisfaction}/tour`, good: true })

  return (
    <div className="panel">
      <p className="panel-title">
        {cur.emoji} {cur.name} ➜ {next.emoji} <strong>{next.name}</strong>
      </p>
      <p className="hint panel-desc">{next.description}</p>
      <div className="chips">
        {chips.map((c) => (
          <Chip key={c.label} {...c} />
        ))}
      </div>
      <button className={`btn btn-upgrade ${game.coins < cost ? 'btn-disabled' : ''}`} onClick={upgrade}>
        Améliorer · {cost} 🪙
      </button>
    </div>
  )
}
