import { FAMILIES } from '../engine/buildings'
import { GRID_SIZE } from '../engine/simulation'
import { useStore } from '../store'

const TIER_LABEL = ['Polluant', 'En progrès', 'Sobre']

export default function Grid() {
  const grid = useStore((s) => s.game.grid)
  const selectTile = useStore((s) => s.selectTile)
  const selected = useStore((s) => s.selectedTile)
  const flash = useStore((s) => s.flash)

  return (
    <section className="room">
      <div className="room-head">
        <span>SALLE SERVEURS</span>
        <span className="room-legend">
          <i className="led led-0" /> polluant <i className="led led-1" /> mieux <i className="led led-2" /> sobre
        </span>
      </div>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
        {grid.map((tile, i) => {
          const fam = FAMILIES[tile.family]
          const t = fam.tiers[tile.tier]
          const f = flash && flash.index === i ? `flash-${flash.kind}` : ''
          return (
            <button
              key={flash && flash.index === i ? `${i}-${flash.id}` : i}
              className={`rack tier-${tile.tier} ${selected === i ? 'rack-selected' : ''} ${f}`}
              onClick={() => selectTile(i)}
              aria-label={`${t.name} — ${TIER_LABEL[tile.tier]}`}
            >
              <span className="rack-leds" aria-hidden>
                {[0, 1, 2].map((d) => (
                  <i key={d} className={`led ${d <= tile.tier ? `led-${tile.tier}` : 'led-off'}`} />
                ))}
              </span>
              <span className="rack-emoji">{t.emoji}</span>
              <span className="rack-label">{fam.short}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
