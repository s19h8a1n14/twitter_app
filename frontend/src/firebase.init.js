// require("dotenv").config();
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getDatabase,ref,onValue,set } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "shanmukh-9be27.firebaseapp.com",
  projectId: "shanmukh-9be27",
  storageBucket: "shanmukh-9be27.appspot.com",
  messagingSenderId: "592594544837",
  appId: "1:592594544837:web:8867fc23ffa34c077d28ac",
  measurementId: "G-KZ9CFS9WBL"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db, app ,ref,onValue,set };