import { useEffect, useState } from 'react'
import { useStore } from '../store'

export default function Toast() {
  const toast = useStore((s) => s.toast)
  const [visibleId, setVisibleId] = useState<number | null>(null)

  useEffect(() => {
    if (!toast) return
    setVisibleId(toast.id)
    const t = setTimeout(() => setVisibleId(null), 1800)
    return () => clearTimeout(t)
  }, [toast])

  if (!toast || visibleId !== toast.id) return null
  return (
    <div className={`toast toast-${toast.kind}`} role="status">
      {toast.text}
    </div>
  )
}
