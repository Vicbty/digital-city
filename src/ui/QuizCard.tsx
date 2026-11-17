import { useState } from 'react'
import { QUIZ_BONUS } from '../engine/simulation'
import type { Question } from '../engine/types'
import { useStore } from '../store'

const BONUS_LABEL = {
  money: `+${QUIZ_BONUS.money} 💰`,
  wellbeing: `+${QUIZ_BONUS.wellbeing} 😊`,
  privacy: `+${QUIZ_BONUS.privacy} 🔒`,
}

export default function QuizCard({ question }: { question: Question }) {
  const finishQuiz = useStore((s) => s.finishQuiz)
  const turn = useStore((s) => s.game.turn)
  const [picked, setPicked] = useState<number | null>(null)
  const answered = picked !== null
  const correct = picked === question.answer

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className={`quiz ${answered ? (correct ? 'quiz-ok' : 'quiz-ko') : ''}`}>
        <p className="quiz-meta">
          Question du tour {turn} · bonus {BONUS_LABEL[question.bonus]}
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
            <p className="quiz-verdict">{correct ? `✅ Bien joué ! ${BONUS_LABEL[question.bonus]}` : '❌ Raté… pas grave !'}</p>
            <p>{question.explication}</p>
            <button className="btn btn-primary" onClick={() => finishQuiz(correct)}>
              Continuer ➜
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
