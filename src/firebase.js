// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, remove, push, onValue } from "firebase/database";
import { browserSessionPersistence, getAuth, onAuthStateChanged, setPersistence, signInAnonymously } from "firebase/auth";

import { getFirestore, collection, getDocs } from "firebase/firestore/lite";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  hiddenForCommit
};

// Initialize Firebase
const fireBaseApp = initializeApp(firebaseConfig);
const db = getDatabase(fireBaseApp);

const authInit = async () => {
  let userId
  const auth = getAuth();
  await setPersistence(auth,browserSessionPersistence)
  // .catch((e) => {
  //   alert('error in auth',e.message)
  // })
  await signInAnonymously(auth)
// .catch((e) => {
//   console.error('error signing in', e)
// })
const user = auth.currentUser;
if(user) {
  console.log('user',user)
  return user.uid
} else {
 console.log('no user signed in')
}
    //  onAuthStateChanged(auth, (user) => {
    //   if(user) {
    //     userId = user
    //     console.log("account data is", user);
    //   } else {
    //     console.error('signed out')
    //   }
    // })
    return userId
};


export { fireBaseApp, db,authInit, ref, set,remove, push, onValue }
// const analytics = getAnalytics(app);
