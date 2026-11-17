import { FAMILIES } from '../engine/buildings'
import type { Family } from '../engine/types'
import { useStore } from '../store'

const ORDER: Family[] = ['servers', 'cooling', 'energy', 'storage', 'hardware']

/** Plan du bâtiment : une salle par famille d'équipements. */
export default function FloorPlan() {
  const grid = useStore((s) => s.game.grid)
  const setView = useStore((s) => s.setView)

  return (
    <section className="plan">
      <div className="plan-head">
        <span className="tag">Plan du site · DC-01</span>
        <button className="link-btn" onClick={() => setView('outside')}>
          Voir l’extérieur
        </button>
      </div>
      <div className="plan-grid">
        {ORDER.map((f) => {
          const fam = FAMILIES[f]
          const units = grid.filter((t) => t.family === f)
          const upgraded = units.filter((t) => t.tier > 0).length
          const best = units.filter((t) => t.tier === 2).length
          const co2 = units.reduce((s, t) => s + fam.tiers[t.tier].co2, 0)
          const minTier = Math.min(...units.map((t) => t.tier))
          return (
            <button key={f} className={`room room-${f}`} onClick={() => setView(f)}>
              <span className="room-name">{fam.room}</span>
              <span className="room-icon">{fam.tiers[minTier].emoji}</span>
              <span className="room-leds" aria-hidden>
                {units.map((t, i) => (
                  <i key={i} className={`led led-${t.tier}`} />
                ))}
              </span>
              <span className="room-meta">
                {upgraded}/{units.length} améliorés{best ? ` · ${best} au max` : ''}
              </span>
              <span className="room-co2">{co2} CO₂/tour</span>
            </button>
          )
        })}
      </div>
      <p className="muted small plan-hint">Touche une salle pour voir ses équipements et les améliorer.</p>
    </section>
  )
}
