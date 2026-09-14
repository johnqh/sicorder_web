// Configure the Firebase China proxy before anything initializes Firebase.
import { setFirebaseProxy } from '@sudobility/di';
setFirebaseProxy(import.meta.env.VITE_FIREBASE_PROXY);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { configureTheme } from '@sudobility/design';
import { defaultTheme, generateThemeCSS } from '@sudobility/design/themes';
import { initializeApp } from './config/initialize';
import './index.css';
import App from './App';

configureTheme(defaultTheme);
const styleEl = document.createElement('style');
styleEl.id = 'sudobility-design-theme';
styleEl.textContent = generateThemeCSS(defaultTheme);
document.head.appendChild(styleEl);

initializeApp();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
