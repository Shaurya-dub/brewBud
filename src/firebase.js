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
let fireBaseApp;
let db
fetch("/.netlify/functions/fetch-firebase")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    // firebaseConfig = data.config_object;
    console.log('firebase data',data)
    const {apiKey,authDomain,databaseURL,projectId,storageBucket,messagingSenderId,appId,measurementId} = data
   firebaseConfig = {
      apiKey: apiKey,
      authDomain: authDomain,
      databaseURL: databaseURL,
      projectId: projectId,
      storageBucket: storageBucket,
      messagingSenderId: messagingSenderId,
      appId: appId,
      measurementId: measurementId,
    };
    fireBaseApp = initializeApp(firebaseConfig);
    db = getDatabase(fireBaseApp);
  });

// Initialize Firebase


const authInit = async () => {
  fetch("/.netlify/functions/fetch-firebase")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // firebaseConfig = data.config_object;
      console.log("firebase data", data);
      const {
        apiKey,
        authDomain,
        databaseURL,
        projectId,
        storageBucket,
        messagingSenderId,
        appId,
        measurementId,
      } = data;
      firebaseConfig = {
        apiKey: apiKey,
        authDomain: authDomain,
        databaseURL: databaseURL,
        projectId: projectId,
        storageBucket: storageBucket,
        messagingSenderId: messagingSenderId,
        appId: appId,
        measurementId: measurementId,
      };
      fireBaseApp = initializeApp(firebaseConfig);
      db = getDatabase(fireBaseApp);
    });
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
