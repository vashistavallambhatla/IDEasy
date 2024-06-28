import { initializeApp,getApp,getApps} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyBkKI2zySI3O4oMi9xXJ-0DbkbmQUAF4Mk",
    authDomain: "ideasy-12f8a.firebaseapp.com",
    projectId: "ideasy-12f8a",
    storageBucket: "ideasy-12f8a.appspot.com",
    messagingSenderId: "239125796924",
    appId: "1:239125796924:web:6924eaf0cd48a6423b0b39",
    measurementId: "G-0K96GJMDDX"
  };

  const app = !getApps.length? initializeApp(firebaseConfig) : getApp();

  const auth=getAuth(app);
  const db=getFirestore(app);

  export {auth,app,db};