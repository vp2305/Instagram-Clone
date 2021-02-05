// go to the website click on settings and down there find config
// npm i firebase

import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
apiKey: "AIzaSyBSe7aKlewj23mx5dIBUeWD9mSNo0TBO4M",
  authDomain: "instagram-clone-9babf.firebaseapp.com",
  projectId: "instagram-clone-9babf",
  storageBucket: "instagram-clone-9babf.appspot.com",
  messagingSenderId: "630727188574",
  appId: "1:630727188574:web:ac2fc5086dd1d426d314cf",
  measurementId: "G-6CPYZJ2DC4"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage(); //this will be used to upload the pictures

export { db, auth, storage };
// export default debugger;