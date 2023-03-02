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

  const getLastMessage = (message) => {
    if (message) {
      if (message.hasOwnProperty("text") && message.text.length > 0)
        return message.text;
      if (message.hasOwnProperty("imageUrls")) return "(Image)";
      if (message.hasOwnProperty("filesUrls")) return "(Attachment)";
    }
    return "";
  };

  const getLastMessageIndex = (startIndex, messages) => {
    const messagesBeforeStartIndex = messages.slice(0, startIndex).reverse();
    const lastIndex = messagesBeforeStartIndex.findIndex((message) => {
      return !message.hasOwnProperty("unsend") || !message.unsend;
    });
    if (lastIndex === -1) {
      return -1;
    }
    return messages.length - lastIndex - 2;
  };

  const unsendMessage = async () => {
    const res = await getDoc(doc(db, "chats", data.chatId));
    const messages = res.data().messages;
    messages[index] = { ...messages[index], unsend: true };

    await updateDoc(doc(db, "chats", data.chatId), {
      messages: messages,
    });

    if (messages[index].text === data.lastMessage) {
      await updateDoc(
        doc(db, "userChats", currentUser.uid),
        {
          [data.chatId + ".lastMessage"]: {
            text: getLastMessage(
              messages[getLastMessageIndex(index, messages)]
            ),
          },
        },
        { merge: true }
      );

      await updateDoc(
        doc(db, "userChats", data.user.uid),
        {
          [data.chatId + ".lastMessage"]: {
            text: getLastMessage(
              messages[getLastMessageIndex(index, messages)]
            ),
          },
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
