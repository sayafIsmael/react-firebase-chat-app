import React, { useContext, useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../config/firebase";
import { ChatOptions } from "./ChatOptions";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [showOptions, setShowOptions] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  //Get chats of the user
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());

        return () => {
          unsub();
        };
      });
    };

    currentUser && currentUser.uid && getChats();
  }, [currentUser]);

  const handleSelect = (u, i, lastRemovedDate) => {
    console.log("Chat Id:", i);
    dispatch({
      type: "CHANGE_USER",
      payload: { ...u, lastRemovedDate: lastRemovedDate || null },
      chatId: i,
    });
  };

  return (
    <div className="chats">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div key={chat[0]}>
            {(chat[1].removed ? chat[1].removed == false : true) && (
              <div
                className="userChat"
                onClick={() =>
                  handleSelect(
                    chat[1].userInfo,
                    chat[0],
                    chat[1].lastRemovedDate
                  )
                }
              >
                <img src={chat[1].userInfo.photoURL} alt="" />
                <div className="userChatInfo">
                  <div className="chatHeader">
                    <span>{chat[1].userInfo.userName}</span>
                    {chat[1].date && (
                      <div className="info">
                        <span>
                          {chat[1].date.toDate().toLocaleTimeString()}
                        </span>
                        <ChatOptions
                          chatId={chat[0]}
                          userId={chat[1].userInfo.uid}
                        />
                      </div>
                    )}
                  </div>
                  <p>{chat[1].lastMessage?.text?.substring(0, 20)}</p>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default Chats;
