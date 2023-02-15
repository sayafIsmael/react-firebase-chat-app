import React, { useContext, useState, useEffect } from "react";
import { MdAttachment, MdSend } from "react-icons/md";
import { BsImageFill } from "react-icons/bs";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  getDoc
} from "firebase/firestore";
import { db, storage } from "./../config/firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [chatId, setChatId] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  // useEffect(()=>{
  //   console.log("data.chatId:",data)
  //   if(data.chatId!="null"){
  //     setChatId(data.chatId)
  //   }
  // },[data, data.chatId])

  //Send message
  const handleSend = async () => {
    console.log("data.chatId:", data.chatId);
    const res = await getDoc(doc(db, "chats", data.chatId));
    if (data.chatId != "null" && res.exists()) {
      if (img) {
        const storageRef = ref(storage, uuid());

        //Upload image to storage
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          (error) => {},
          () => {
            //Get image url & store message to chats collection
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                await updateDoc(doc(db, "chats", data.chatId), {
                  messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                    img: downloadURL,
                  }),
                });
              }
            );
          }
        );
      } else {
        //Store message data to chats collection
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
      }

      try {
        //Update current user's userChats last message
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [data.chatId + ".lastMessage"]: {
            text,
          },
          [data.chatId + ".date"]: serverTimestamp(),
        });

        console.log("selected user currentUser.uid: ",currentUser.uid)
        console.log("selected user data.user.uid: ",data.user.uid)

        //Update user's userChats last message
        await updateDoc(doc(db, "userChats", data.user.uid), {
          [data.chatId + ".lastMessage"]: {
            text,
          },
          [data.chatId + ".date"]: serverTimestamp(),
        });
      } catch (error) {
        console.log("Update userChats error", error)
      }

      setText("");
      setImg(null);
    } else {
      toast.error("Please select an user to send message!");
    }
  };

  //On press enter in input
  const handleKey = (e) => {
    e.code === "Enter" && handleSend();
  };

  return (
    <div className="messageInput">
      <MdAttachment size={20} color="#C3CAD9" />
      <input
        type={"file"}
        style={{ display: "none" }}
        id="file"
        onChange={(e) => setImg(e.target.files[0])}
      />
      <label htmlFor="file">
        <BsImageFill size={20} color="#C3CAD9" />
      </label>
      <input
        placeholder="Type message"
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={handleKey}
      />
      <MdSend size={20} color="#3361ff" onClick={handleSend} />
    </div>
  );
};

export default Input;
