import { useState } from 'react'
import { STREAK_MIN, quizReward } from '../engine/simulation'
import type { Question } from '../engine/types'
import { useStore } from '../store'

export default function QuizCard({ question }: { question: Question }) {
  const finishQuiz = useStore((s) => s.finishQuiz)
  const streak = useStore((s) => s.game.streak)
  const [picked, setPicked] = useState<number | null>(null)
  const answered = picked !== null
  const correct = picked === question.answer
  const reward = quizReward(streak)
  const streakBonus = streak + 1 >= STREAK_MIN

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className={`quiz ${answered ? (correct ? 'quiz-ok' : 'quiz-ko') : ''}`}>
        <p className="quiz-meta">
          🧠 Quiz · bonne réponse = +{reward} 🪙{streakBonus ? ' 🔥 bonus série !' : ''}
        </p>
        <h2 className="quiz-question">{question.question}</h2>
        <div className="quiz-choices">
          {question.choices.map((c, i) => {
            let cls = 'choice'
            if (answered && i === question.answer) cls += ' choice-ok'
            else if (answered && i === picked) cls += ' choice-ko'
            return (
              <button key={i} className={cls} disabled={answered} onClick={() => setPicked(i)}>
                {c}
              </button>
            )
          })}
        </div>
        {answered && (
          <div className="quiz-feedback">
            <p className="quiz-verdict">{correct ? `✅ Bien joué ! +${reward} 🪙` : '❌ Raté… pas grave !'}</p>
            <p>{question.explication}</p>
            <p className="quiz-source">
              📚 Source :{' '}
              {question.url ? (
                <a href={question.url} target="_blank" rel="noopener noreferrer">
                  {question.source}
                </a>
              ) : (
                question.source
              )}
            </p>
            <button className="btn btn-primary" onClick={() => finishQuiz(correct)}>
              Continuer ➜
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
