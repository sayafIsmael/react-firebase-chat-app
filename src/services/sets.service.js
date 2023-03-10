import { auth, db, storage } from "@/config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  doc,
  collection,
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
    const myCollectionRef = doc(db, "sets", id);

    try {
      //Add Set
      await setDoc(myCollectionRef, {
        id,
        name,
        description,
        images: isImages ? await uploadFiles(images) : null,
        video: isImages ? null : (await uploadFiles([video]))[0],
        boards,
        userId,
        createdAt: serverTimestamp(),
      });

      resolve({ success: true });
    } catch (error) {
      reject(error);
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
