import type { TradeOffer } from '../engine/types'
import { useStore } from '../store'

export default function TradeCard({ offer }: { offer: TradeOffer }) {
  const resolveTrade = useStore((s) => s.resolveTrade)
  const coins = useStore((s) => s.game.coins)
  const { co2, capacity, demand } = offer.effect
  const chips: { label: string; good: boolean }[] = []
  chips.push({ label: offer.coins >= 0 ? `🪙 +${offer.coins}` : `🪙 ${offer.coins}`, good: offer.coins >= 0 })
  if (co2) chips.push({ label: `🏭 ${co2 > 0 ? '+' : ''}${co2}/tour`, good: co2 < 0 })
  if (capacity) chips.push({ label: `⚡ ${capacity > 0 ? '+' : ''}${capacity}`, good: capacity > 0 })
  if (demand) chips.push({ label: `📈 demande ${demand > 0 ? '+' : ''}${demand}`, good: demand < 0 })
  const canPay = coins + offer.coins >= 0

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="quiz trade">
        <p className="quiz-meta">Proposition d’un data center voisin</p>
        <h2 className="quiz-question">
          {offer.emoji} {offer.partner}
        </h2>
        <p>{offer.text}</p>
        <div className="chips">
          {chips.map((c) => (
            <span key={c.label} className={`chip ${c.good ? 'chip-good' : 'chip-bad'}`}>
              {c.label}
            </span>
          ))}
        </div>
        <p className="muted small">{offer.duration === 'level' ? 'Effet valable jusqu’à la fin du niveau.' : 'Effet permanent.'}</p>
        <div className="trade-actions">
          <button className="btn btn-ghost" onClick={() => resolveTrade(false)}>
            Refuser
          </button>
          <button className="btn btn-primary" disabled={!canPay} onClick={() => resolveTrade(true)}>
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}
