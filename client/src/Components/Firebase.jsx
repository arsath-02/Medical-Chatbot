// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfcy0KA3fK5rXfftPkk4HKSFqxH4u50l0",
  authDomain: "medical-chatbot-3ccc2.firebaseapp.com",
  projectId: "medical-chatbot-3ccc2",
  storageBucket: "medical-chatbot-3ccc2.firebasestorage.app",
  messagingSenderId: "1083097145119",
  appId: "1:1083097145119:web:5b19d7c0bd506bc5961a2a",
  measurementId: "G-S6MZLNY940"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export {auth}