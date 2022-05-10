
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyBmYdvpfqKy3Y0H2Tr9XWsZ39EYHzA47zQ',
  authDomain: 'firecheck-e0015.firebaseapp.com',
  projectId: 'firecheck-e0015',
  storageBucket: 'firecheck-e0015.appspot.com',
  messagingSenderId: '1074915481072',
  appId: '1:1074915481072:web:3abf7773607e5821feb935',
  databaseURL: 'https://firecheck-e0015.firebaseio.com',
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export default firebase;



