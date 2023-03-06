import { auth, db, storage } from "@/config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  doc,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  where,
  getDoc,
  field,
  query,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";

export function createBoard({
  name,
  description,
  defaultPositions,
  thumbnail,
  userId,
}) {
  return new Promise(async (resolve, reject) => {
    const date = new Date().getTime();
    const storageRef = ref(storage, `board-thumbnails${date}`);
    const myCollectionRef = collection(db, "boards");

    await uploadBytesResumable(storageRef, thumbnail).then(() => {
      getDownloadURL(storageRef)
        .then(async (downloadURL) => {
          try {
            //Add board
            await addDoc(myCollectionRef, {
              id: uuid(),
              name,
              description,
              defaultPositions,
              thumbnail: downloadURL,
              sets: [],
              reviews: [],
              userId,
              createdAt: serverTimestamp()
            });

            resolve({ success: true });
          } catch (error) {
            reject(error);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
}

export async function getAllBoards(callback) {
  const query = collection(db, "boards");
  const unsubscribe = onSnapshot(query, (querySnapshot) => {
    const documents = querySnapshot.docs.map((doc) => doc.data());
    callback(documents);
  });
  return unsubscribe;
}

export async function getAllBoardsName(callback) {
  const query = collection(db, "boards");
  const unsubscribe = onSnapshot(query, (querySnapshot) => {
    const documents = querySnapshot.docs.map((doc) => {
      const { id, name } = doc.data();
      return { id, name };
    });
    callback(documents);
  });
  return unsubscribe;
}
