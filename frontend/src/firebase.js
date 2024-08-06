// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANbw1TVfcAO6Ocz0AcxQM-pxQ16nHx8lc",
  authDomain: "uploadfile-7b024.firebaseapp.com",
  projectId: "uploadfile-7b024",
  storageBucket: "uploadfile-7b024.appspot.com",
  messagingSenderId: "756006398685",
  appId: "1:756006398685:web:d27bfbfd558eee9b540934",
  measurementId: "G-7W3SRXCRJD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export default app;