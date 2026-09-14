import {
  initializeFirebaseService,
  initializeNetworkService,
  initializeStorageService,
} from '@sudobility/di';
import { initWebVitals } from '@sudobility/components';

/** Call once before rendering. Firebase (analytics only) starts only when configured. */
export function initializeApp(): void {
  initializeStorageService();
  if (import.meta.env.VITE_FIREBASE_API_KEY) {
    initializeFirebaseService({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    });
  }
  initializeNetworkService();
  initWebVitals();
}
