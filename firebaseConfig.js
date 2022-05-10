import {initializeApp} from 'firebase/app';
// import {getAuth} from 'firebase/auth';
// import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCqsxzsr51xdI7MZR9YAwqY-62KELvFJ0E',
  authDomain: 'attendance-75759.firebaseapp.com',
  projectId: 'attendance-75759',
  storageBucket: 'attendance-75759.appspot.com',
  messagingSenderId: '984991268053',
  appId: '1:984991268053:web:0a39a014b7264af197f65c',
};

const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

export const authentication = getAuth(app);
