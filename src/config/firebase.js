import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDpKvYQwsB3-3DtyPeNqHYqO8fgrRQFFlI",
  authDomain: "chat-app-react-54524.firebaseapp.com",
  projectId: "chat-app-react-54524",
  storageBucket: "chat-app-react-54524.appspot.com",
  messagingSenderId: "411550097238",
  appId: "1:411550097238:web:f8b5315433ef461e03c0f7",
  measurementId: "G-3FPDZZRMSJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
const analytics = getAnalytics(app);