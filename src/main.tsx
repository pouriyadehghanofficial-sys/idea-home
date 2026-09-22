import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { contentRepository } from './services/contentRepository';

async function bootstrap() {
  // Synchronous for cached visitors (0ms), bounded bootstrap (~150-300ms) for first-time visitors
  // Guarantees default content is NEVER visibly rendered before persisted server content
  await contentRepository.bootstrapSiteContent(1500);

  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }
}

bootstrap();
