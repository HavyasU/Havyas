// ============================================
// Firebase App Initialization (Singleton)
// Guards against missing config during build & dev
// ============================================
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase is configured
const isConfigured =
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "your_api_key_here" &&
  firebaseConfig.apiKey !== "";

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

if (isConfigured) {
  const isAlreadyApp = getApps().length > 0;
  app = isAlreadyApp ? getApp() : initializeApp(firebaseConfig);

  if (isAlreadyApp) {
    db = getFirestore(app);
  } else {
    try {
      db = initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });
    } catch (e) {
      console.warn(
        "Firestore initialization with cache failed, fallback to default",
        e,
      );
      db = getFirestore(app);
    }
  }

  auth = getAuth(app);
}

export { db, auth };
export default app;
export { isConfigured };
