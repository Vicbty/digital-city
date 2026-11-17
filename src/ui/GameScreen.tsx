import { MAX_TURNS } from '../engine/simulation'
import { useStore } from '../store'
import Grid from './Grid'
import QuizCard from './QuizCard'
import StatsBar from './StatsBar'
import Toolbar from './Toolbar'

export default function GameScreen() {
  const currentQuiz = useStore((s) => s.currentQuiz)
  const openQuiz = useStore((s) => s.openQuiz)
  const turn = useStore((s) => s.game.turn)

  return (
    <main className="screen game">
      <StatsBar />
      <Grid />
      <div className="bottom">
        <Toolbar />
        <button className="btn btn-primary btn-next" onClick={openQuiz}>
          {turn === MAX_TURNS ? 'Dernier tour ➜' : 'Tour suivant ➜'}
        </button>
      </div>
      {currentQuiz && <QuizCard key={currentQuiz.id} question={currentQuiz} />}
    </main>
  )
}
