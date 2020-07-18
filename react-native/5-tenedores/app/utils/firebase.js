import firebase from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyAPPGSUPQyHR32s82GVDkqiubPpuNaNlPY",
  authDomain: "tenedores-bb614.firebaseapp.com",
  databaseURL: "https://tenedores-bb614.firebaseio.com",
  projectId: "tenedores-bb614",
  storageBucket: "tenedores-bb614.appspot.com",
  messagingSenderId: "1008075101462",
  appId: "1:1008075101462:web:7fe517df105240786cac37",
};

// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);
