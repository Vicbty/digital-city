import { BUILDINGS } from '../engine/buildings'
import { useStore } from '../store'

export default function Grid() {
  const grid = useStore((s) => s.game.grid)
  const tapCell = useStore((s) => s.tapCell)
  const flash = useStore((s) => s.flash)
  const selected = useStore((s) => s.selected)

  return (
    <div className={`grid ${selected ? 'grid-placing' : ''}`}>
      {grid.map((cell, i) => {
        const f = flash && flash.index === i ? `flash-${flash.kind}` : ''
        return (
          <button
            key={flash && flash.index === i ? `${i}-${flash.id}` : i}
            className={`cell ${cell ? 'cell-built' : ''} ${f}`}
            onClick={() => tapCell(i)}
            aria-label={cell ? BUILDINGS[cell].name : 'Case vide'}
          >
            {cell ? BUILDINGS[cell].emoji : ''}
          </button>
        )
      })}
    </div>
  )
}
