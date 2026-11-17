import { FAMILIES } from '../engine/buildings'
import type { Family, TierStats } from '../engine/types'
import { useStore } from '../store'

const TIER_LABEL = ['Polluant', 'En progrès', 'Sobre']

function effects(from: TierStats, to: TierStats): { label: string; good: boolean }[] {
  const out: { label: string; good: boolean }[] = []
  if (to.co2 !== from.co2) out.push({ label: `CO₂ ${to.co2 - from.co2}/tour`, good: to.co2 < from.co2 })
  if (to.capacity !== from.capacity) out.push({ label: `capacité +${to.capacity - from.capacity}`, good: true })
  if (to.demand !== from.demand) out.push({ label: `demande ${to.demand - from.demand}`, good: true })
  if (to.income !== from.income) out.push({ label: `+${to.income} pièces/tour`, good: true })
  if (to.satisfaction !== from.satisfaction) out.push({ label: `satisfaction +${to.satisfaction}/tour`, good: true })
  return out
}

/** Une zone du data center : à quoi elle sert, ses versions possibles, ses équipements. */
export default function ZoneView({ family }: { family: Family }) {
  const grid = useStore((s) => s.game.grid)
  const coins = useStore((s) => s.game.coins)
  const setView = useStore((s) => s.setView)
  const upgrade = useStore((s) => s.upgrade)
  const flash = useStore((s) => s.flash)
  const fam = FAMILIES[family]
  const units = grid.map((t, index) => ({ ...t, index })).filter((t) => t.family === family)

  return (
    <section className="zone">
      <button className="link-btn" onClick={() => setView('plan')}>
        ← Plan du site
      </button>
      <h2 className="zone-title">{fam.room}</h2>
      <p className="zone-role">{fam.role}</p>

      <div className="evolution" aria-label="Versions possibles">
        {fam.tiers.map((t, i) => (
          <div key={i} className={`evo evo-${i}`}>
            <span className="evo-emoji">{t.emoji}</span>
            <strong>{t.name}</strong>
            <span className="evo-tag">{TIER_LABEL[i]}</span>
            <span className="evo-co2">{t.co2} CO₂/tour</span>
          </div>
        ))}
      </div>

      <h3 className="zone-sub">Tes équipements ({units.length})</h3>
      <ul className="units">
        {units.map((u, n) => {
          const cur = fam.tiers[u.tier]
          const next = u.tier < 2 ? fam.tiers[u.tier + 1] : null
          const cost = u.tier < 2 ? fam.upgradeCosts[u.tier as 0 | 1] : null
          const f = flash && flash.index === u.index ? `flash-${flash.kind}` : ''
          return (
            <li key={flash && flash.index === u.index ? `${u.index}-${flash.id}` : u.index} className={`unit tier-${u.tier} ${f}`}>
              <div className="unit-main">
                <span className="unit-emoji">{cur.emoji}</span>
                <div className="unit-text">
                  <span className="unit-id">
                    {fam.short} n°{n + 1} <i className={`led led-${u.tier}`} /> {TIER_LABEL[u.tier]}
                  </span>
                  <strong>{cur.name}</strong>
                  <span className="muted small">{cur.description}</span>
                </div>
              </div>
              {next && cost !== null ? (
                <div className="unit-up">
                  <span className="unit-next">
                    → {next.emoji} {next.name}
                  </span>
                  <span className="chips">
                    {effects(cur, next).map((e) => (
                      <span key={e.label} className={`chip ${e.good ? 'chip-good' : 'chip-bad'}`}>
                        {e.label}
                      </span>
                    ))}
                  </span>
                  <button className={`btn btn-upgrade ${coins < cost ? 'btn-poor' : ''}`} onClick={() => upgrade(u.index)}>
                    Améliorer · {cost} 🪙
                  </button>
                </div>
              ) : (
                <p className="unit-max">Version la plus sobre ✓</p>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
