import { Component, type ReactNode } from 'react'
import { AppRouteProvider } from './routes.tsx'

interface EBState {
  error: Error | null
}

class ErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { error: null }

  static getDerivedStateFromError(error: Error): EBState {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, color: '#f04452', background: '#0b0b16', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
          <h2 style={{ color: '#ffd166' }}>⚠ App Error</h2>
          <p><strong>{this.state.error.message}</strong></p>
          <p style={{ fontSize: 12, color: '#aaa' }}>{this.state.error.stack}</p>
        </div>
      )
    }
    return this.props.children
  }
}

export function App() {
  return (
    <ErrorBoundary>
      <AppRouteProvider />
    </ErrorBoundary>
  )
}
