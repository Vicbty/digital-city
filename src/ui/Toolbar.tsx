import { BUILDING_LIST, BUILDINGS } from '../engine/buildings'
import { useStore } from '../store'

function sign(n: number) {
  return (n > 0 ? '+' : '') + n
}

export default function Toolbar() {
  const selected = useStore((s) => s.selected)
  const money = useStore((s) => s.game.money)
  const select = useStore((s) => s.select)
  const sel = selected ? BUILDINGS[selected] : null

  return (
    <div className="toolbar-wrap">
      <p className="hint">
        {sel ? (
          <>
            {sel.emoji} <strong>{sel.name}</strong> — {sel.description} Touche une case vide.
          </>
        ) : (
          'Choisis un bâtiment, puis touche une case.'
        )}
      </p>
      <div className="toolbar">
        {BUILDING_LIST.map((b) => (
          <button
            key={b.type}
            className={`tool ${selected === b.type ? 'tool-selected' : ''} ${money < b.cost ? 'tool-poor' : ''}`}
            onClick={() => select(b.type)}
          >
            <span className="tool-emoji">{b.emoji}</span>
            <span className="tool-name">{b.name}</span>
            <span className="tool-cost">{b.cost} 💰</span>
            <span className="tool-stats">
              <span className={b.income >= 0 ? 'up' : 'down'}>💰{sign(b.income)}</span>
              <span className={b.co2 <= 0 ? 'up' : 'down'}>🏭{sign(b.co2)}</span>
              {b.wellbeing !== 0 && <span className={b.wellbeing > 0 ? 'up' : 'down'}>😊{sign(b.wellbeing)}</span>}
              {b.privacy !== 0 && <span className={b.privacy > 0 ? 'up' : 'down'}>🔒{sign(b.privacy)}</span>}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
