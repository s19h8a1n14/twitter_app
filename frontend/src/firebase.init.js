import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCs3VCPQNKYm9R7DwobreA56AqKfp7EDgc",
  authDomain: "twitter-27cc1.firebaseapp.com",
  projectId: "twitter-27cc1",
  storageBucket: "twitter-27cc1.appspot.com",
  messagingSenderId: "585972141359",
  appId: "1:585972141359:web:7bedd934ebcfdff13c25da",
  measurementId: "G-GP8EVH4YRG",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;
