// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "**************",
  authDomain: "brewbud-80fd3.firebaseapp.com",
  databaseURL: "https://brewbud-80fd3-default-rtdb.firebaseio.com",
  projectId: "brewbud-80fd3",
  storageBucket: "brewbud-80fd3.appspot.com",
  messagingSenderId: "303106774801",
  appId: "******************",
  measurementId: "G-QBZKLD2Z1K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
