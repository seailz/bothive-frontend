import './app.css'
import App from './App.svelte'
import { initializeApp } from "firebase/app";
import Login from './pages/Login.svelte';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBuIY8PZWQs58WM4Kzi4uipnT95NcRk8Kk",
  authDomain: "seailz-bh.firebaseapp.com",
  projectId: "seailz-bh",
  storageBucket: "seailz-bh.appspot.com",
  messagingSenderId: "128292263014",
  appId: "1:128292263014:web:93e0bb1cfaf44b4e9989a7"
};

// Initialize Firebase
const fb = initializeApp(firebaseConfig);

// If user is logged in, show app, else show login page
const auth = getAuth(fb);
// @ts-ignore
var app;
auth.onAuthStateChanged((user) => {
  if (user) {
    // @ts-ignore
    app = new App({
      target: document.getElementById('app'),
    })
  } else {
    // @ts-ignore
    app = new Login({
      target: document.getElementById('app'),
    })
  }})

export default app;
// @ts-ignore
export { fb }// @ts-ignore

