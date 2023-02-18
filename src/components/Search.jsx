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
import { ChatContext } from "../context/ChatContext";
import { v4 as uuid } from "uuid";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState([]);
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  //Search user from users collection
  const handleSearch = async () => {
    if (username.length) {
      const q = query(
        collection(db, "users"),
        where("userName", ">=", username),
        where("userName", "<=", username + "\uf8ff")
      );

      try {
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => doc.data());
        setUsers(data);
      } catch (error) {
        console.log(error);
        setErr(error);
      }
    } else {
      setUsers([]);
    }
  };

  //Select user to chat
  const handleSelect = async (user) => {
    const res = await getDoc(doc(db, "userChats", currentUser.uid));
    const resData = res.data();
    const data = Object.keys(resData).map((key) => ({
      chatId: key,
      userInfo: resData[key].userInfo,
      lastRemovedDate: resData[key].lastRemovedDate || null,
    }));

    console.log("data:", data);

    if (data.length > 0) {
      const chat = [...data].find((chat) => chat.userInfo.uid === user.uid);
      if (chat) {
        console.log("Found chat with uid:", user.uid, chat);
        dispatch({
          type: "CHANGE_USER",
          payload: {
            uid: user.uid,
            userName: user.userName,
            photoURL: user.photoURL,
            lastRemovedDate: chat.lastRemovedDate,
          },
          chatId: chat.chatId,
        });
        setUsername("");
      } else {
        console.log("No chat found with uid:", user.uid);
        const combinedID = uuid();
        dispatch({
          type: "CHANGE_USER",
          payload: {
            uid: user.uid,
            userName: user.userName,
            photoURL: user.photoURL,
          },
          chatId: combinedID,
        });
        setUsername("");
      }
    } else {
      console.log("No chat found with uid:", user.uid);
      const combinedID = uuid();
      dispatch({
        type: "CHANGE_USER",
        payload: {
          uid: user.uid,
          userName: user.userName,
          photoURL: user.photoURL,
        },
        chatId: combinedID,
      });
      setUsername("");
    }
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
          onChange={(e) => {
            setUsername(e.target.value);
            handleSearch();
          }}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {username.length > 0 &&
        users.map((user, index) => {
          return (
            currentUser.uid !== user.uid && (
              <div
                className="userChat"
                onClick={() => handleSelect(user)}
                key={user.uid}
              >
                <img src={user.photoURL} alt="" />
                <div className="userChatInfo">
                  <div className="chatHeader">
                    <span>{user.userName}</span>
                    {/* <span>5:30pm</span> */}
                  </div>
                  {/* <p>Message preview goes here</p> */}
                </div>
              </div>
            )
          );
        })}
    </div>
  );
};

export default Search;
