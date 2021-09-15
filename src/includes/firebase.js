import firebase from 'firebase/app';
// enables auth methods
import 'firebase/auth';
// enables database functions
import 'firebase/firestore';
// to use storage service
import 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID,
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
