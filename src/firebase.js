// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOTN-ktAaGhBMYKy67ANjNF9MFPRLQeIY",
  authDomain: "brewbud-80fd3.firebaseapp.com",
  databaseURL: "https://brewbud-80fd3-default-rtdb.firebaseio.com",
  projectId: "brewbud-80fd3",
  storageBucket: "brewbud-80fd3.appspot.com",
  messagingSenderId: "303106774801",
  appId: "1:303106774801:web:6da98e2516b0eedb7a9eb0",
  measurementId: "G-QBZKLD2Z1K",
};

// Initialize Firebase
const fireBaseApp = initializeApp(firebaseConfig);
const db = getDatabase(fireBaseApp);

export { fireBaseApp, db, ref, set, push, onValue }
// const analytics = getAnalytics(app);
