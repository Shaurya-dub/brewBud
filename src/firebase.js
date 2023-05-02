// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getDatabase,
  ref,
  set,
  remove,
  push,
  onValue,
} from "firebase/database";
import {
  browserSessionPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInAnonymously,
} from "firebase/auth";

import { getFirestore, collection, getDocs } from "firebase/firestore/lite";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
let firebaseConfig;
fetch("/.netlify/functions/fetch-firebase")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    // firebaseConfig = data.config_object;
    console.log('firebase data',data)
  //  firebaseConfig = {
  //     apiKey: data.api_key,
  //     authDomain: "brewbud-80fd3.firebaseapp.com",
  //     databaseURL: "https://brewbud-80fd3-default-rtdb.firebaseio.com",
  //     projectId: "brewbud-80fd",
  //     storageBucket: "brewbud-80fd3.appspot.com",
  //     messagingSenderId: "303106774801",
  //     appId: "1:303106774801:web:6da98e2516b0eedb7a9eb0",
  //     measurementId: "G-QBZKLD2Z1K",
  //   };
  firebaseConfig = data.res_object
  });

// Initialize Firebase
const fireBaseApp = initializeApp(firebaseConfig);

const db = getDatabase(fireBaseApp);

const authInit = async () => {
  const auth = getAuth();
  await setPersistence(auth, browserSessionPersistence);
  // .catch((e) => {
  //   alert('error in auth',e.message)
  // })
  await signInAnonymously(auth);

  // .catch((e) => {
  //   console.error('error signing in', e)
  // })
  const user = auth.currentUser;
  return user?.uid;
};

export { fireBaseApp, db, authInit, ref, set, remove, push, onValue };
// const analytics = getAnalytics(app);
