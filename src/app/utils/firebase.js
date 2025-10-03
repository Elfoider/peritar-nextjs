// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyB3R3C-ZDWoPUmEOoErHeLg5d5VrHMKfPY",
  authDomain: "peritar-d0812.firebaseapp.com",
  databaseURL: "https://peritar-d0812-default-rtdb.firebaseio.com",
  projectId: "peritar-d0812",
  storageBucket: "peritar-d0812.firebasestorage.app",
  messagingSenderId: "550267665897",
  appId: "1:550267665897:web:e922be186c4eb5c9fedf78",
  measurementId: "G-NQ1DL9WG2T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
