import { TURNS_PER_LEVEL, turnInLevel } from '../engine/simulation'
import { useStore } from '../store'
import Grid from './Grid'
import LevelCard from './LevelCard'
import QuizCard from './QuizCard'
import StatsBar from './StatsBar'
import TradeCard from './TradeCard'
import UpgradePanel from './UpgradePanel'

export default function GameScreen() {
  const phase = useStore((s) => s.phase)
  const currentQuiz = useStore((s) => s.currentQuiz)
  const currentTrade = useStore((s) => s.currentTrade)
  const levelCard = useStore((s) => s.levelCard)
  const openQuiz = useStore((s) => s.openQuiz)
  const turn = useStore((s) => s.game.turn)
  const lastOfLevel = turnInLevel(turn) === TURNS_PER_LEVEL

  return (
    <main className="screen game">
      <StatsBar />
      <Grid />
      <div className="bottom">
        <UpgradePanel />
        <button className="btn btn-primary btn-next" onClick={openQuiz}>
          {lastOfLevel ? 'Finir le niveau ➜' : 'Tour suivant ➜'}
        </button>
      </div>
      {phase === 'quiz' && currentQuiz && <QuizCard key={currentQuiz.id} question={currentQuiz} />}
      {phase === 'trade' && currentTrade && <TradeCard offer={currentTrade} />}
      {phase === 'level' && levelCard && <LevelCard data={levelCard} />}
    </main>
  )
}
