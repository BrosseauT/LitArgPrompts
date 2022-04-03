import * as firebase from 'firebase';

let db_config = {
    apiKey: "AIzaSyAQgVYgrxv6CHhMSpE3RLMW1DnnU6JKyRU",
    authDomain: "litargprompts.firebaseapp.com",
    projectId: "litargprompts",
    storageBucket: "litargprompts.appspot.com",
    messagingSenderId: "782723645243",
    appId: "1:782723645243:web:aac6c9d702dc5062e3c11e",
    measurementId: "G-Y4R25GL532"
  };
  firebase.initializeApp(db_config);

  export default firebase;