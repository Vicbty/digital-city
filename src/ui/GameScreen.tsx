import { TURNS_PER_LEVEL, turnInLevel } from '../engine/simulation'
import { useStore } from '../store'
import Exterior from './Exterior'
import FloorPlan from './FloorPlan'
import HelpModal from './HelpModal'
import Hud from './Hud'
import LevelCard from './LevelCard'
import QuizCard from './QuizCard'
import TradeCard from './TradeCard'
import ZoneView from './ZoneView'

export default function GameScreen() {
  const phase = useStore((s) => s.phase)
  const view = useStore((s) => s.view)
  const showHelp = useStore((s) => s.showHelp)
  const currentQuiz = useStore((s) => s.currentQuiz)
  const currentTrade = useStore((s) => s.currentTrade)
  const levelCard = useStore((s) => s.levelCard)
  const openQuiz = useStore((s) => s.openQuiz)
  const turn = useStore((s) => s.game.turn)
  const lastOfLevel = turnInLevel(turn) === TURNS_PER_LEVEL

  return (
    <main className="screen game">
      <Hud />
      <div className="view">
        {view === 'outside' && <Exterior />}
        {view === 'plan' && <FloorPlan />}
        {view !== 'outside' && view !== 'plan' && <ZoneView family={view} />}
      </div>
      {view !== 'outside' && (
        <div className="bottom">
          <button className="btn btn-primary btn-big" onClick={openQuiz}>
            {lastOfLevel ? 'Finir le niveau →' : 'Tour suivant → question'}
          </button>
        </div>
      )}
      {phase === 'quiz' && currentQuiz && <QuizCard key={currentQuiz.id} question={currentQuiz} />}
      {phase === 'trade' && currentTrade && <TradeCard offer={currentTrade} />}
      {phase === 'level' && levelCard && <LevelCard data={levelCard} />}
      {showHelp && <HelpModal />}
    </main>
  )
}
