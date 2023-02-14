import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "./../config/firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  //Search user from users collection
  const handleSearch = async () => {
    const q = query(collection(db, "users"), where("userName", "==", username));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error) {
      console.log(error);
      setErr(error);
    }
  };

  //Select user to chat
  const handleSelect = async () => {
    //check whether the group(chats in firestore) exist, if not create
    const combinedID =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedID));
      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedID), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedID + ".userInfo"]: {
            uid: user.uid,
            userName: user.userName,
            photoURL: user.photoURL,
          },
          [combinedID + ".date"]: serverTimestamp(),
        });

        //Create selected user chat
        try {
          await updateDoc(doc(db, "userChats", user.uid), {
            [combinedID + ".userInfo"]: {
              uid: currentUser.uid,
              userName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            },
            [combinedID + ".date"]: serverTimestamp(),
          });
        } catch (error) {
          console.log("updateDoc update err", error);
        }
      }
    } catch (error) {
      console.log(error);
    }

    setUser(null);
    setUsername("");
  };

  //On press enter in search input 
  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  return (
    <div className="Search">
      <div className="searchform">
        <input
          type="text"
          placeholder="Search..."
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {user && currentUser.uid !== user.uid && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <div className="chatHeader">
              <span>{user.userName}</span>
              {/* <span>5:30pm</span> */}
            </div>
            {/* <p>Message preview goes here</p> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
