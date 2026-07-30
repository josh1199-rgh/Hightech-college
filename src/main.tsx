import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { CMSProvider } from './context/CMSContext.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('SW registered:', registration.scope);
      },
      (error) => {
        console.warn('SW registration failed:', error);
      }
    );
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <CMSProvider>
        <App />
      </CMSProvider>
    </ErrorBoundary>
  </StrictMode>,
);
