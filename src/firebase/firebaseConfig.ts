// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, push } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9lbE3wBPlOxDjFz5ejbuAdCwx_xUX36c",
  authDomain: "uai-extension.firebaseapp.com",
  projectId: "uai-extension",
  storageBucket: "uai-extension.firebasestorage.app",
  messagingSenderId: "119584678147",
  appId: "1:119584678147:web:3ed6dac824f1cbc5298936",
  measurementId: "G-VZPYDEBP3Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const database = getDatabase(app);
export { database, ref, push };