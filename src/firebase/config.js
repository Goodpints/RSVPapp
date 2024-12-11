// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRNTaIhMBi-b1xdOKigg2fE_tDrGbUM6w",
  authDomain: "rsvpapp-cb320.firebaseapp.com",
  projectId: "rsvpapp-cb320",
  storageBucket: "rsvpapp-cb320.appspot.com", // Corrected storage bucket typo
  messagingSenderId: "600446201138",
  appId: "1:600446201138:web:8b8733a3e51e90feaafb2b",
  measurementId: "G-SWLQE9M8P0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Auth service
export const auth = getAuth(app);
export const db = getFirestore();