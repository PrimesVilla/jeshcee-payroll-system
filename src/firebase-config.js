import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCdJ0ujMvdtOqvvZ2ps2IJAJJK4Zysy1sQ",
  authDomain: "jeshceepay.firebaseapp.com",
  projectId: "jeshceepay",
  storageBucket: "jeshceepay.appspot.com",
  messagingSenderId: "462542145771",
  appId: "1:462542145771:web:0ab30056b24ad08d3c96ae"
};
  
  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);