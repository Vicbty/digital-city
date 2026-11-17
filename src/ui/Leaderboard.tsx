import type { LeaderboardEntry } from '../lib/supabase'

interface Props {
  entries: (LeaderboardEntry & { me?: boolean })[]
  title?: string
  extra?: LeaderboardEntry | null // le joueur, s'il n'est pas dans la liste
}

const MEDALS = ['🥇', '🥈', '🥉']

export default function Leaderboard({ entries, title = 'Classement', extra }: Props) {
  return (
    <section className="board">
      <h2>🏆 {title}</h2>
      {entries.length === 0 ? (
        <p className="muted small">Personne encore… sois le premier !</p>
      ) : (
        <ol>
          {entries.map((e, i) => (
            <li key={`${e.pseudo}-${i}`} className={e.me ? 'board-me' : ''}>
              <span className="board-rank">{MEDALS[i] ?? i + 1}</span>
              <span className="board-name">{e.pseudo}</span>
              <strong>{e.score}</strong>
            </li>
          ))}
          {extra && (
            <li className="board-me">
              <span className="board-rank">…</span>
              <span className="board-name">{extra.pseudo}</span>
              <strong>{extra.score}</strong>
            </li>
          )}
        </ol>
      )}
    </section>
  )
}
