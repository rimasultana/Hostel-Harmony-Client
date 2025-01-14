// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKLi7DQeHVHEHNAeA0xyyYYavrQ91yNnk",
  authDomain: "hostel-harmony-c616d.firebaseapp.com",
  projectId: "hostel-harmony-c616d",
  storageBucket: "hostel-harmony-c616d.firebasestorage.app",
  messagingSenderId: "605256104206",
  appId: "1:605256104206:web:3ee4ce7a8ed151beea7f5f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;
