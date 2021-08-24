import firebase from 'firebase/app';
// enables auth methods
import 'firebase/auth';
// enables database functions
import 'firebase/firestore';
// to use storage service
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB6Shu9bm9rauknLI0W9C-E1vfPVrXJF9g',
  authDomain: 'music-c7c39.firebaseapp.com',
  projectId: 'music-c7c39',
  storageBucket: 'music-c7c39.appspot.com',
  messagingSenderId: '50213739165',
  appId: '1:50213739165:web:73600c8058c666ad6ad274',
  measurementId: 'G-4Q058LZ9HT',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Define important exports
const auth = firebase.auth();

const db = firebase.firestore();

db.enablePersistence().catch((err) => {
  console.log(`Firebase persistence error ${err}`);
});

// This will automatically create the collection
const usersCollection = db.collection('users');
const songsCollection = db.collection('songs');
const commentsCollection = db.collection('comments');

const storage = firebase.storage();

// Export as named exports
export { auth, usersCollection, songsCollection, commentsCollection, storage };
