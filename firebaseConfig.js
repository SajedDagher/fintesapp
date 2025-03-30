// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const firebaseConfig = {
  apiKey: "AIzaSyCjWcRm6gaGcACYQfUAbfXAi2a3ANeOuag",
  authDomain: "fitbuddy-97025.firebaseapp.com",
  projectId: "fitbuddy-97025",
  storageBucket: "fitbuddy-97025.appspot.com",
  messagingSenderId: "195872456479",
  appId: "1:195872456479:web:9a16a897dc7980f3b9fa2a",
  measurementId: "G-DCE3R2YKLN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage), // Add persistence
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db }; // Export Auth and Firestore