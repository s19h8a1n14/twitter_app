// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXRJK4O4bIh6xmbcAvYehh_B71z_2CUFM",
  authDomain: "shanmukh-9be27.firebaseapp.com",
  databaseURL: "https://shanmukh-9be27-default-rtdb.firebaseio.com",
  projectId: "shanmukh-9be27",
  storageBucket: "shanmukh-9be27.firebasestorage.app",
  messagingSenderId: "592594544837",
  appId: "1:592594544837:web:8867fc23ffa34c077d28ac",
  measurementId: "G-KZ9CFS9WBL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export default auth;