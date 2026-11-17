import { computeStats } from '../engine/simulation'
import type { Family, Tier } from '../engine/types'
import { useStore } from '../store'

const LED = ['#d64545', '#d98a00', '#1f9d55']

/** Vue extérieure du data center : le dessin change avec les améliorations. */
export default function Exterior() {
  const game = useStore((s) => s.game)
  const setView = useStore((s) => s.setView)
  const st = computeStats(game)
  const tiersOf = (f: Family): Tier[] => game.grid.filter((t) => t.family === f).map((t) => t.tier)

  const servers = tiersOf('servers')
  const storage = tiersOf('storage')
  const cooling = tiersOf('cooling')
  const energy = tiersOf('energy')
  const hardware = tiersOf('hardware')
  const diesel = energy.filter((t) => t === 0).length
  const grid = energy.filter((t) => t === 1).length
  const solar = energy.filter((t) => t === 2).length
  const zombies = storage.filter((t) => t === 0).length
  const heatReuse = cooling.some((t) => t === 2)
  const clean = Math.max(0, Math.min(1, st.reductionPct / 60))
  const sky = clean > 0.66 ? '#dcebf7' : clean > 0.33 ? '#e3e7ea' : '#e6e1d8'
  const genPos = [
    [300, 182],
    [326, 182],
    [300, 158],
    [326, 158],
    [313, 134],
  ]

  return (
    <section className="outside">
      <svg viewBox="0 0 360 240" className="outside-svg" role="img" aria-label="Vue extérieure du data center">
        <rect width="360" height="240" fill={sky} />
        <rect y="200" width="360" height="40" fill="#cdd4db" />
        <line x1="0" y1="232" x2="360" y2="232" stroke="#b5bec7" strokeDasharray="10 8" />

        {/* Éolienne si énergie renouvelable */}
        {solar > 0 && (
          <g>
            <line x1="40" y1="70" x2="40" y2="150" stroke="#9aa5b1" strokeWidth="3" />
            <g className="spin" style={{ transformOrigin: '40px 70px' }}>
              <line x1="40" y1="70" x2="40" y2="44" stroke="#5d6b79" strokeWidth="3" strokeLinecap="round" />
              <line x1="40" y1="70" x2="62" y2="83" stroke="#5d6b79" strokeWidth="3" strokeLinecap="round" />
              <line x1="40" y1="70" x2="18" y2="83" stroke="#5d6b79" strokeWidth="3" strokeLinecap="round" />
            </g>
          </g>
        )}

        {/* Logements chauffés par la chaleur des serveurs */}
        {heatReuse && (
          <g>
            <rect x="10" y="160" width="40" height="40" fill="#f4efe7" stroke="#9aa5b1" />
            <polygon points="6,160 30,142 54,160" fill="#c8b9a6" />
            <rect x="24" y="182" width="10" height="18" fill="#9aa5b1" />
            <path d="M70 175 H 50" stroke="#e07a2f" strokeWidth="4" />
            <text x="30" y="214" fontSize="8" textAnchor="middle" fill="#5d6b79">chauffé ♨</text>
          </g>
        )}

        {/* Bâtiment */}
        <rect x="70" y="110" width="220" height="90" fill="#f4f6f8" stroke="#8a96a3" strokeWidth="1.5" />
        <rect x="70" y="106" width="220" height="5" fill="#8a96a3" />
        <rect x="148" y="116" width="64" height="14" rx="2" fill="#1b232c" />
        <text x="180" y="126" fontSize="8.5" textAnchor="middle" fill="#fff" fontFamily="ui-monospace, Menlo, monospace">
          DC-01
        </text>

        {/* Baies serveurs (fenêtres) */}
        {servers.map((t, i) => (
          <g key={`s${i}`}>
            <rect x={80 + i * 29.5} y="138" width="23" height="16" fill="#26313c" rx="1.5" />
            <circle cx={85 + i * 29.5} cy="143" r="2.2" fill={LED[t]} className={t === 0 ? 'blink' : ''} />
          </g>
        ))}
        {/* Baies de stockage */}
        {storage.map((t, i) => (
          <g key={`d${i}`}>
            <rect x={88 + i * 36} y="164" width="26" height="11" fill="#3b4754" rx="1.5" />
            <circle cx={93 + i * 36} cy="169.5" r="2" fill={LED[t]} />
          </g>
        ))}
        <rect x="170" y="180" width="20" height="20" fill="#9aa5b1" />

        {/* Unités de refroidissement sur le toit */}
        {cooling.map((t, i) => {
          const x = [82, 118, 216, 252][i] ?? 82 + i * 36
          return (
            <g key={`c${i}`}>
              <rect x={x} y="92" width="28" height="14" fill="#c3ccd5" stroke="#8a96a3" />
              {t === 0 && (
                <path
                  className="heat"
                  d={`M${x + 6} 88 q3 -5 0 -10 q-3 -5 0 -10 M${x + 16} 88 q3 -5 0 -10 q-3 -5 0 -10`}
                  stroke="#d64545"
                  strokeWidth="1.6"
                  fill="none"
                />
              )}
              {t >= 1 && (
                <g className="spin" style={{ transformOrigin: `${x + 14}px 99px` }}>
                  <circle cx={x + 14} cy="99" r="5" fill="none" stroke={t === 2 ? '#1f9d55' : '#2b7bd0'} strokeWidth="1.5" />
                  <line x1={x + 9} y1="99" x2={x + 19} y2="99" stroke={t === 2 ? '#1f9d55' : '#2b7bd0'} strokeWidth="1.5" />
                </g>
              )}
            </g>
          )
        })}

        {/* Panneaux solaires sur le toit */}
        {Array.from({ length: solar }, (_, i) => (
          <g key={`p${i}`} transform={`translate(${152 + (i % 3) * 20} ${i < 3 ? 94 : 82})`}>
            <polygon points="0,10 6,0 22,0 16,10" fill="#2b5ea8" stroke="#1d3f73" />
            <line x1="3" y1="5" x2="19" y2="5" stroke="#8fb3e6" strokeWidth="0.6" />
          </g>
        ))}

        {/* Raccord au réseau électrique */}
        {grid > 0 && (
          <g stroke="#7b8794" strokeWidth="1.5" fill="none">
            <path d="M352 200 L344 120 L336 200 M340 150 H348 M338 175 H350" />
            <path d="M344 122 Q 320 112 290 118" strokeDasharray="3 2" />
          </g>
        )}

        {/* Générateurs diesel et leur fumée */}
        {genPos.slice(0, diesel).map(([x, y], i) => (
          <g key={`g${i}`}>
            <rect x={x} y={y} width="22" height="16" fill="#6b7682" rx="1.5" />
            <rect x={x + 14} y={y - 8} width="4" height="8" fill="#4b5560" />
            <circle className="smoke" cx={x + 16} cy={y - 12} r="4" fill="#7d7d7d" style={{ animationDelay: `${i * 0.4}s` }} />
            <circle className="smoke" cx={x + 19} cy={y - 20} r="5.5" fill="#8f8f8f" style={{ animationDelay: `${i * 0.4 + 0.8}s` }} />
          </g>
        ))}

        {/* Matériel usagé devant le bâtiment */}
        {hardware.map((t, i) => {
          const x = 206 + i * 22
          if (t === 0) return <polygon key={`h${i}`} points={`${x},224 ${x + 9},208 ${x + 18},224`} fill="#8b6f4e" />
          if (t === 1) return <rect key={`h${i}`} x={x + 2} y="210" width="14" height="14" rx="2" fill="#1f9d55" />
          return (
            <g key={`h${i}`}>
              <rect x={x} y="210" width="18" height="14" rx="2" fill="#2b7bd0" />
              <text x={x + 9} y="220" fontSize="8" textAnchor="middle" fill="#fff">
                ↻
              </text>
            </g>
          )
        })}

        {/* Nuage de données zombies */}
        {zombies > 0 && (
          <g opacity={0.35 + zombies * 0.12}>
            <ellipse cx="120" cy="50" rx={22 + zombies * 4} ry={12 + zombies * 1.5} fill="#9aa1a8" />
            <ellipse cx={100 - zombies * 2} cy="56" rx={14 + zombies * 2} ry="10" fill="#9aa1a8" />
            <text x="120" y="54" fontSize="8" textAnchor="middle" fill="#fff">
              données zombies
            </text>
          </g>
        )}
      </svg>

      <div className="outside-info">
        <p>
          <span className="tag">Émissions</span> <strong>{st.co2} CO₂/tour</strong>{' '}
          <span className={st.reductionPct > 0 ? 'up' : 'muted'}>(−{Math.max(0, st.reductionPct)} % depuis le début)</span>
        </p>
        <button className="btn btn-primary btn-big" onClick={() => setView('plan')}>
          Entrer dans le data center
        </button>
      </div>
    </section>
  )
}
