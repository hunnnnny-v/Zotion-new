import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAozBSmiYosn9Q36hnDXB3VfJ6aczDpZwU",
  authDomain: "zotion-a6107.firebaseapp.com",
  projectId: "zotion-a6107",
  storageBucket: "zotion-a6107.appspot.com",
  messagingSenderId: "301105473243",
  appId: "1:301105473243:web:fd09b3c1fe9e6dc7a08efe",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
export {db};