// Import necessary functions from the native Firebase SDK
import { firebase } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRNTaIhMBi-b1xdOKigg2fE_tDrGbUM6w",
  authDomain: "rsvpapp-cb320.firebaseapp.com",
  projectId: "rsvpapp-cb320",
  storageBucket: "rsvpapp-cb320.firebasestorage.app",
  messagingSenderId: "600446201138",
  appId: "1:600446201138:web:8b8733a3e51e90feaafb2b",
  measurementId: "G-SWLQE9M8P0"
};

// Initialize Firebase (native SDK)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // If already initialized, use the existing instance
}

// Export auth for use in your app
export { auth };
