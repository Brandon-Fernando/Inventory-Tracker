// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDB3qpht0SeHslzCbxVYOnGjn_9rBlpf_w",
  authDomain: "inventory-management-aa118.firebaseapp.com",
  projectId: "inventory-management-aa118",
  storageBucket: "inventory-management-aa118.appspot.com",
  messagingSenderId: "785941552799",
  appId: "1:785941552799:web:cab7a9c83953eac2b70caa",
  measurementId: "G-PS66LK4XET"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}