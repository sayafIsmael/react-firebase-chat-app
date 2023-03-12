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
  setDoc,
  query,
  updateDoc,
  increment,
  writeBatch,
} from "firebase/firestore";
import { FirestoreDataConverter } from "@firebase/util";
import { v4 as uuid } from "uuid";

export function createBoard(
  { name, description, defaultPositions, thumbnail, userId },
  callback
) {
  return new Promise(async (resolve, reject) => {
    const id = uuid();
    const date = new Date().getTime();
    const storageRef = ref(storage, `board-thumbnails${date}`);
    const myCollectionRef = doc(db, "boards", id);

    await uploadBytesResumable(storageRef, thumbnail).then(() => {
      getDownloadURL(storageRef)
        .then(async (downloadURL) => {
          try {
            //Add board
            await setDoc(myCollectionRef, {
              id,
              name,
              description,
              defaultPositions,
              thumbnail: downloadURL,
              sets: [],
              userId,
              createdAt: serverTimestamp(),
            });

            resolve({ success: true });
            callback({ id, name });
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

export async function getAllBoardsByUserId(userId, callback) {
  const boardRef = collection(db, "boards");
  const q = query(boardRef, where("userId", "==", userId));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
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

export async function getBoardDetails(userId, boardId, callback) {
  const setsRef = collection(db, "sets");

  const boardsRef = collection(db, "boards");
  const boardQuery = query(boardsRef, where("id", "==", boardId));

  const reviewsRef = doc(db, `reviews/${userId}/boards`, boardId);
  const existingReview = await getDoc(reviewsRef);

  // listen for updates to the board document with id == boardId
  const unsubscribe = onSnapshot(boardQuery, (boardSnapshot) => {
    const board = boardSnapshot.docs[0].data();

    if (existingReview.exists()) {
      const review = existingReview.data();
      const sets = review.sets;
      const response = { sets, board, reviewd: true };
      callback(response);
    } else {
      const setsQuery = query(
        setsRef,
        where("boards", "array-contains", { id: boardId, name: board.name })
      );

      onSnapshot(setsQuery, (setsSnapshot) => {
        const sets = setsSnapshot.docs.map((doc) => doc.data());
        // return the sets and the board with id boardId
        const response = { sets, board, reviewd: false };
        // console.log(response);
        callback(response);
      });
    }
  });

  return unsubscribe;
}

export function createReview(data) {
  return new Promise(async (resolve, reject) => {
    const { boardId, userId, sets, leaderboardData } = data;

    const reviewsRef = doc(db, `reviews/${userId}/boards`, boardId);

    const existingReview = await getDoc(reviewsRef);

    const leaderboardRef = collection(db, "leaderboards", boardId, "sets");

    try {
      if (!existingReview.exists()) {
        const batch = writeBatch(db);

        const promises = leaderboardData.map(async (set) => {
          const { id, point } = set;
          const setRef = doc(leaderboardRef, id);
          const setData = await getDoc(setRef);

          if (setData.exists()) {
            const pointIncrement = increment(point);
            batch.update(setRef, {
              point: pointIncrement,
            });
          } else {
            batch.set(setRef, set);
          }
        });

        Promise.all(promises).then(async () => {
          await batch.commit();
          //Add Review
          await setDoc(reviewsRef, { sets });
          resolve({ success: true });
        });
      } else {
        reject({ error: "Review already submitted" });
      }
    } catch (error) {
      reject({ error: "Something went wrong" });
      console.log("error", error);
    }
  });
}

export async function getLeaderBoardDetails(boardId, callback) {
  const setsRef = collection(db, "sets");

  const leaderboardRef = collection(db, "leaderboards", boardId, "sets");

  const boardRef = doc(collection(db, "boards"), boardId);
  const boardData = await getDoc(boardRef);

  // listen for updates to the board document with id == boardId
  const unsubscribe = onSnapshot(leaderboardRef, (leaderboardSnapshot) => {
    const data = leaderboardSnapshot.docs.map((doc) => doc.data());
    if (data.length > 0) {
      const sets = data.sort((a, b) => b.point - a.point);
      const response = { sets, board: boardData.data() };
      console.log("leaderBoards data: ", response);
      callback(response);
    } else {
      const response = { sets: [], board: boardData.data() };
      console.log("No such document!");
      callback(response);
    }
  });

  return unsubscribe;
}
