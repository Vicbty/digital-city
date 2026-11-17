import { useEffect } from 'react'
import { logVisit } from './lib/supabase'
import { useStore } from './store'
import Dashboard from './ui/Dashboard'
import EndScreen from './ui/EndScreen'
import GameScreen from './ui/GameScreen'
import Home from './ui/Home'
import Toast from './ui/Toast'

export default function App() {
  const screen = useStore((s) => s.screen)
  const isDashboard = window.location.pathname.replace(/\/+$/, '') === '/dashboard'

  useEffect(() => {
    if (!isDashboard) void logVisit()
  }, [isDashboard])

  if (isDashboard) return <Dashboard />

  return (
    <>
      {screen === 'home' && <Home />}
      {screen === 'game' && <GameScreen />}
      {screen === 'end' && <EndScreen />}
      <Toast />
    </>
  )
}
