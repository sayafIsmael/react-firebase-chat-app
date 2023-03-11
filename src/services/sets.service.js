import { auth, db, storage } from "@/config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  doc,
  collection,
  updateDoc,
  addDoc,
  setDoc,
  getDocs,
  onSnapshot,
  where,
  orderBy,
  getDoc,
  field,
  query,
  serverTimestamp,
  writeBatch,
  arrayUnion,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { uploadFiles } from "./files.service";

export function createSet({
  name,
  description,
  isImages,
  images,
  video,
  boards,
  userId,
}) {
  return new Promise(async (resolve, reject) => {
    const id = uuid();
    const setCollectionRef = doc(db, "sets", id);
    const set = {
      id,
      name,
      description,
      images: isImages ? await uploadFiles(images) : null,
      video: isImages ? null : (await uploadFiles([video]))[0],
      boards,
      userId,
      createdAt: serverTimestamp(),
    };

    try {
      //Add Set

      const batch = writeBatch(db);

      const promises = boards.map(async (board) => {
        const boardId = board.id;
        const leaderboardRef = doc(db, `leaderboards/${boardId}/sets`, id);

        batch.set(leaderboardRef, { ...set, point: 0 });

        const { createdAt, ...newObject } = set;
        const reviewsRef = doc(db, `reviews/${userId}/boards`, boardId);
        const reviewData = await getDoc(reviewsRef);
        if (reviewData.exists()) {
          const setData = {
            sets: arrayUnion(newObject),
          };
          await updateDoc(reviewsRef, setData);
        }
      });

      Promise.all(promises).then(async () => {
        await batch.commit();
        await setDoc(setCollectionRef, set);
        resolve({ success: true });
      });
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
}

export async function getAllSets(userId, callback) {
  const q = query(collection(db, "sets"), where("userId", "==", userId));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const documents = querySnapshot.docs.map((doc) => doc.data());
    console.log("Sets data:", documents);
    callback(documents);
  });
  return unsubscribe;
}
