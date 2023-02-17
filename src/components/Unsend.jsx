import React, { useEffect, useState, useContext } from "react";
import {
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "./../config/firebase";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

export const Unsend = ({ canUnsend, index }) => {
  const [isUnsendPossible, setIsUnsendPossible] = useState(canUnsend);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = () =>
      setTimeout(() => {
        setIsUnsendPossible(false);
      }, 30000);

    return () => {
      unSub();
    };
  }, []);

  const unsendMessage = async () => {
    const res = await getDoc(doc(db, "chats", data.chatId));
    const messages = res.data().messages;
    messages[index] = { ...messages[index], unsend: true };
    console.log("messages: ", messages);

    await updateDoc(doc(db, "chats", data.chatId), {
      messages: messages,
    });

    if (messages[index].text === data.lastMessage) {
      await updateDoc(
        doc(db, "userChats", currentUser.uid),
        {
          [data.chatId + ".lastMessage"]: { text: "removed" },
        },
        { merge: true }
      );

      await updateDoc(
        doc(db, "userChats", data.user.uid),
        {
          [data.chatId + ".lastMessage"]: { text: "removed" },
        },
        { merge: true }
      );
    }
  };

  return (
    <>
      {isUnsendPossible && (
        <span className="unsend" onClick={() => unsendMessage()}>
          Unsend
        </span>
      )}
    </>
  );
};
