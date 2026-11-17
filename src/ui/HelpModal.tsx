import { useStore } from '../store'
import HowToPlay from './HowToPlay'

export default function HelpModal() {
  const setShowHelp = useStore((s) => s.setShowHelp)
  return (
    <div className="modal" role="dialog" aria-modal="true" onClick={() => setShowHelp(false)}>
      <div className="card" onClick={(e) => e.stopPropagation()}>
        <h2 className="card-title">Comment jouer</h2>
        <HowToPlay />
        <button className="btn btn-primary btn-big" onClick={() => setShowHelp(false)}>
          J’ai compris
        </button>
      </div>
    </div>
  )
}
