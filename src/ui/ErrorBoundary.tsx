import { Component, type ReactNode } from 'react'

interface State {
  error: Error | null
}

/** Affiche un message (au lieu d'une page blanche) si un écran plante. */
export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error) {
    console.error('[digital-city] crash', error)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <main className="screen" style={{ justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="title-sm">Oups, un bug 🔧</h1>
        <p className="muted">{this.state.error.message}</p>
        <button className="btn btn-primary btn-big" onClick={() => window.location.reload()}>
          Recharger le jeu
        </button>
      </main>
    )
  }
}
