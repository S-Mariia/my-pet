import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  getAuth, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider,
} from 'firebase/auth';
import {getDatabase} from "@firebase/database";

export type ProviderType = GoogleAuthProvider | FacebookAuthProvider;
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_DATABASEURL,
};

const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(firebaseApp);
const database = getDatabase(firebaseApp)
const auth = getAuth(firebaseApp);
const google = new GoogleAuthProvider();
google.setCustomParameters({
  prompt: 'select_account ',
});
const facebook = new FacebookAuthProvider();

const signInWithSocialPopup = (provider:ProviderType) => signInWithPopup(auth, provider);

export {
  firebaseApp,
  firestore,
  auth,
  signInWithSocialPopup,
  facebook,
  google,
  database
};
