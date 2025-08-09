// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCOi_UJQMrWbgpbZ_wYSJSOTjV1r1HG5ZI",
    authDomain: "vignesh-biotree.firebaseapp.com",
    projectId: "vignesh-biotree",
    storageBucket: "vignesh-biotree.firebasestorage.app",
    messagingSenderId: "661408142859",
    appId: "1:661408142859:web:1060618ab660967026990e",
    measurementId: "G-LLYF9PCFQ7"
  };    
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db = getFirestore(app);
export const auth = getAuth(app);
