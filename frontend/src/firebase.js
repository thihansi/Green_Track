// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "green-track-a44c7.firebaseapp.com",
  projectId: "green-track-a44c7",
  storageBucket: "green-track-a44c7.appspot.com",
  messagingSenderId: "241178132193",
  appId: "1:241178132193:web:23d81a3b6528c8cd9cc1a0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);