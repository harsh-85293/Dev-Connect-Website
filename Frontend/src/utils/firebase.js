import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Object.values(firebaseConfig).every((value) => value && String(value).trim() !== '');

let app = null;
let auth = null;
let googleProvider = null;
let googleRedirectResultPromise = null;
const GOOGLE_REDIRECT_ATTEMPT_KEY = 'devconnect:googleRedirectAttempt';
const GOOGLE_REDIRECT_HANDLED_KEY = 'devconnect:googleRedirectHandled';
const REDIRECT_FALLBACK_ERRORS = new Set([
  'auth/network-request-failed',
  'auth/popup-blocked',
  'auth/cancelled-popup-request',
]);

const getSessionStorage = () => {
  if (typeof window === 'undefined') return null;

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

const getFirebaseAuthErrorMessage = (error) => {
  const code = error?.code || '';

  switch (code) {
    case 'auth/network-request-failed':
      return 'Google sign-in could not reach Firebase. Check your authDomain, Firebase authorized domains, and browser privacy settings.';
    case 'auth/popup-blocked':
      return 'The browser blocked the Google sign-in popup. The app will try a redirect flow instead.';
    case 'auth/cancelled-popup-request':
      return 'A second Google sign-in request cancelled the first one. Try again.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in Firebase Authentication.';
    case 'auth/operation-not-allowed':
      return 'Google sign-in is disabled in Firebase Authentication.';
    case 'auth/invalid-api-key':
    case 'auth/invalid-auth-domain':
      return 'Firebase config is invalid. Check VITE_FIREBASE_API_KEY and VITE_FIREBASE_AUTH_DOMAIN.';
    default:
      return error?.message || 'Google sign-in failed.';
  }
};

const shouldFallbackToRedirect = (error) => REDIRECT_FALLBACK_ERRORS.has(error?.code);

if (hasFirebaseConfig) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    prompt: 'select_account',
  });
}

export const isFirebaseConfigured = hasFirebaseConfig;
export { getFirebaseAuthErrorMessage };

export const getGoogleRedirectSignInResult = async () => {
  if (!hasFirebaseConfig || !auth || !googleProvider) {
    return null;
  }

  if (!googleRedirectResultPromise) {
    googleRedirectResultPromise = (async () => {
      const storage = getSessionStorage();
      const attemptId = storage?.getItem(GOOGLE_REDIRECT_ATTEMPT_KEY);

      if (!attemptId) {
        return null;
      }

      if (storage?.getItem(GOOGLE_REDIRECT_HANDLED_KEY) === attemptId) {
        return null;
      }

      const result = await getRedirectResult(auth);

      if (!result?.user) {
        return null;
      }

      storage?.setItem(GOOGLE_REDIRECT_HANDLED_KEY, attemptId);

      const idToken = await result.user.getIdToken();
      return { idToken, user: result.user };
    })().finally(() => {
      googleRedirectResultPromise = null;
    });
  }

  return googleRedirectResultPromise;
};

const beginGoogleRedirectSignIn = async () => {
  const storage = getSessionStorage();
  const attemptId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  storage?.setItem(GOOGLE_REDIRECT_ATTEMPT_KEY, attemptId);
  storage?.removeItem(GOOGLE_REDIRECT_HANDLED_KEY);

  await signInWithRedirect(auth, googleProvider);
  return { redirectStarted: true };
};

export const signInWithGoogle = async () => {
  if (!hasFirebaseConfig || !auth || !googleProvider) {
    throw new Error('Google sign-in is not configured yet. Add Firebase VITE_* environment variables in Vercel.');
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    return { idToken, user: result.user };
  } catch (error) {
    if (shouldFallbackToRedirect(error)) {
      return beginGoogleRedirectSignIn();
    }

    throw error;
  }
};

export default app;
