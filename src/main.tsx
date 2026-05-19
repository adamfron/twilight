import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import { ErrorBoundary } from './components/ErrorBoundary';

const rootEl = document.getElementById('root');

if (!rootEl) {
  const fallback = document.createElement('div');
  fallback.style.padding = '16px';
  fallback.style.margin = '16px';
  fallback.style.border = '1px solid #fecaca';
  fallback.style.borderRadius = '10px';
  fallback.style.background = '#fff1f2';
  fallback.style.color = '#9f1239';
  fallback.innerHTML = '<h2>TWILIGHT Diagnostic Panel</h2><p>Missing root element (#root) in index.html.</p>';
  document.body.appendChild(fallback);
} else {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );
}
