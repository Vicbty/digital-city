import { FAMILIES } from '../engine/buildings'
import { GRID_SIZE } from '../engine/simulation'
import { useStore } from '../store'

export default function Grid() {
  const grid = useStore((s) => s.game.grid)
  const selectTile = useStore((s) => s.selectTile)
  const selected = useStore((s) => s.selectedTile)
  const flash = useStore((s) => s.flash)

  return (
    <div className="grid" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
      {grid.map((tile, i) => {
        const t = FAMILIES[tile.family].tiers[tile.tier]
        const f = flash && flash.index === i ? `flash-${flash.kind}` : ''
        return (
          <button
            key={flash && flash.index === i ? `${i}-${flash.id}` : i}
            className={`cell tier-${tile.tier} ${selected === i ? 'cell-selected' : ''} ${f}`}
            onClick={() => selectTile(i)}
            aria-label={t.name}
          >
            <span className="cell-emoji">{t.emoji}</span>
            <span className="cell-dots" aria-hidden>
              {[0, 1, 2].map((d) => (
                <i key={d} className={d <= tile.tier ? 'on' : ''} />
              ))}
            </span>
          </button>
        )
      })}
    </div>
  )
}
