import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, message: error instanceof Error ? error.message : String(error) };
  }

  componentDidCatch(error: unknown): void {
    console.error('TWILIGHT runtime error:', error);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, border: '1px solid #fecaca', borderRadius: 10, background: '#fff1f2', color: '#9f1239' }}>
          <h2 style={{ marginTop: 0 }}>TWILIGHT Diagnostic Panel</h2>
          <p>The application hit a runtime error and could not render normally.</p>
          <p><b>Details:</b> {this.state.message ?? 'Unknown error'}</p>
          <p>Please check browser console logs and input values.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
