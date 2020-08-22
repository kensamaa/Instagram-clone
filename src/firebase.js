import firebase from 'firebase'


  const firebaseApp=firebase.initializeApp({
    apiKey: "AIzaSyDVJpmJJ_vSXuV5kLwhLGiIF7hy_09FOv8",
    authDomain: "instagram-clone-react-964b9.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-964b9.firebaseio.com",
    projectId: "instagram-clone-react-964b9",
    storageBucket: "instagram-clone-react-964b9.appspot.com",
    messagingSenderId: "212154134032",
    appId: "1:212154134032:web:e503f7e471ae3e7f79a495",
    measurementId: "G-19681VC252"
  });
  const db=firebaseApp.firestore();
  const auth=firebase.auth();
  const storage=firebase.storage();

  export{ db,auth,storage };