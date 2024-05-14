// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDsr_HuIK0G3AAVZQib6qMBwSSEyyoqP4",
  authDomain: "todo-app-12826.firebaseapp.com",
  projectId: "todo-app-12826",
  storageBucket: "todo-app-12826.appspot.com",
  messagingSenderId: "515445492216",
  appId: "1:515445492216:web:7591b1d983e021e34b2e0d",
  measurementId: "G-MEMV6L2F51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app); // Initialize Firestore
const provider = new GoogleAuthProvider();

export { app, db, auth, analytics, storage, provider}; // Export the Firestore instance along with the Firebase app
