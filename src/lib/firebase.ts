// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, ref, set } from "firebase/database"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { getFunctions } from "firebase/functions"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUfNfYOrvimnmi95B8ck7ka-qIZOsnF5g",
  authDomain: "voices-of-kenya.firebaseapp.com",
  projectId: "voices-of-kenya",
  storageBucket: "voices-of-kenya.firebasestorage.app",
  messagingSenderId: "643737797136",
  appId: "1:643737797136:web:a45fe578da296f0893c095"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the Firebase services
export const db = getDatabase(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);