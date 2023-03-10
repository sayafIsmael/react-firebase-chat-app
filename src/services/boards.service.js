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
              createdAt: serverTimestamp(),
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

export async function getBoardDetails(boardId, callback) {
  const setsRef = collection(db, "sets");

  const boardsRef = collection(db, "boards");
  const boardQuery = query(boardsRef, where("id", "==", boardId));

  // listen for updates to the board document with id == boardId
  const unsubscribe = onSnapshot(boardQuery, (boardSnapshot) => {
    const board = boardSnapshot.docs[0].data();

    const setsQuery = query(
      setsRef,
      where("boards", "array-contains", { id: boardId, name: board.name })
    );

    onSnapshot(setsQuery, (setsSnapshot) => {
      const sets = setsSnapshot.docs.map((doc) => doc.data());
      // return the sets and the board with id boardId
      const response = { sets, board };
      // console.log(response);
      callback(response);
    });
  });

  return unsubscribe;
}

export function createReview(data) {
  return new Promise(async (resolve, reject) => {
    const { boardId, userId, sets, leaderboardData } = data;

    const reviewsCollection = collection(db, "reviews");
    const reviewsRef = doc(reviewsCollection, userId);
    const existingReview = await getDoc(reviewsRef);

    const leaderboardRef = doc(collection(db, "leaderBoards"), boardId);
    const existingLeaderBoard = await getDoc(leaderboardRef);

    try {
      if (!existingReview.exists()) {
        //Add Review
        await setDoc(
          reviewsRef,
          {
            [boardId]: sets,
          },
          { merge: true }
        );

        // Update or create the document
        if (existingLeaderBoard.exists()) {
          const batch = writeBatch(db);

          leaderboardData.forEach((item) => {
            const { id, point } = item;
            const leaderboardDocField = `${id}.point`;
            const pointIncrement = increment(point);
            batch.update(leaderboardRef, {
              [leaderboardDocField]: pointIncrement,
            });
          });
          await batch.commit();
        } else {
          const data = {};
          leaderboardData.forEach((item) => {
            data[item.id] = item; // Store the item with the ID as the key in the leaderboardData object
          });
          await setDoc(leaderboardRef, data, { merge: true });
        }

        resolve({ success: true });
      } else {
        reject({ error: "Review already submitted" });
      }
    } catch (error) {
      reject({ error: "Something went wrong" });
      console.log("error", error);
    }
  });
}
