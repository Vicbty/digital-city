/** Logo Digital City : une baie serveur avec trois voyants (rouge → orange → vert). */
export default function Logo({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Logo Digital City">
      <rect width="64" height="64" rx="14" fill="#1b232c" />
      <rect x="16" y="10" width="32" height="44" rx="3" fill="#eef1f4" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="20" y={15 + i * 13} width="24" height="9" rx="1.5" fill="#3b4754" />
          <circle cx="25" cy={19.5 + i * 13} r="2.2" fill={['#d64545', '#d98a00', '#1f9d55'][i]} />
          <rect x="30" y={18.5 + i * 13} width="10" height="2" rx="1" fill="#8a96a3" />
        </g>
      ))}
    </svg>
  )
}
