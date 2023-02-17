import React, { useEffect, useState, useContext, useRef } from "react";
import { RxDotsHorizontal } from "react-icons/rx";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "./../config/firebase";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { ChatContext } from "../context/ChatContext";

export const ChatOptions = ({ chatId, userId }) => {
  const componentRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { dispatch, data } = useContext(ChatContext);

  useEffect(() => {
    // Add event listener to detect clicks outside the component
    const handleClickOutside = (event) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [componentRef]);

  //Delete chat as soft delete
  const deleteChat = async () => {
    try {
      //delete from current user chat
      await updateDoc(
        doc(db, "userChats", currentUser.uid),
        {
          [chatId + ".removed"]: true,
        },
        { merge: true }
      );

      if (data.chatId === chatId) {
        dispatch({ type: "CHANGE_USER", payload: {}, chatId: "null" });
      }
      toast.success("Chat deleted successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <RxDotsHorizontal
        onClick={(e) => {
          e.stopPropagation();
          setShowOptions(true);
        }}
        style={{ height: 20 }}
      />
      {showOptions && (
        <div
          ref={componentRef}
          onClick={(e) => {
            e.stopPropagation();
            deleteChat();
          }}
        >
          <p>Delete</p>
        </div>
      )}
    </div>
  );
};
