import React, { useContext, useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { db } from "../config/firebase";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);

  //Get messages from chats collection
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages);
      } else {
        setMessages([]);
      }
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  const isDeletedConversation = (message) => {
    // Get Firebase server timestamp
    const lastRemovedDate = data.user.lastRemovedDate;

    //Check is it past or not
    if (lastRemovedDate && lastRemovedDate.toDate() > message.date.toDate()) {
      return true;
    }
    return false;
  };

  return (
    <div className="messages">
      {messages.map((m, i) => {
        if (!isDeletedConversation(m) && (m.unsend && m.unsend == true ? false : true )) {
          return <Message message={m} key={i} index={i}/>;
        }
      })}
    </div>
  );
};

export default Messages;
