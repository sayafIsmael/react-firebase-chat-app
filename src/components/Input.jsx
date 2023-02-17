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
  getDoc,
  setDoc,
} from "firebase/firestore";
import ProgressBar from "react-bootstrap/ProgressBar";
import { db, storage } from "./../config/firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";

const Input = () => {
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [imagesURL, setImagesURL] = useState([]);
  const [progress, setProgress] = useState(65);
  const [filenames, setFilenames] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { data, dispatch } = useContext(ChatContext);

  //Upload images and store images to the imageUrls
  const uploadFiles = async (files, attachments) => {
    const promises = [];

    for (const [index, file] of files.entries()) {
      const id = uuid();
      const storageRef = ref(storage, id);
      const uploadTask = uploadBytesResumable(storageRef, file);

      const promise = new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
          },
          (error) => {
            console.log("upload error: ", error);
            reject(error);
          },
          async () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                if (attachments) {
                  resolve({ filename: filenames[index], url: downloadURL });
                } else {
                  resolve(downloadURL);
                }
              }
            );
          }
        );
      });

      promises.push(promise);
    }

    const downloadUrls = await Promise.all(promises);
    setImagesURL([]);
    setFilenames([]);
    return downloadUrls;
  };

  //Send message
  const handleSend = async () => {
    console.log("data.chatId:", data.chatId);
    const res = await getDoc(doc(db, "chats", data.chatId));
    if (data.chatId != "null") {
      const chatExists = res.exists();
      if (!chatExists) {
        console.log("Chat not exists!");
        createChat(() => {
          sendMessage();
        });
      } else {
        sendMessage();
      }

      dispatch({
        type: "CHANGE_USER",
        payload: data.user,
        chatId: data.chatId,
        lastRemovedDate: data.lastRemovedDate || "null",
        lastMessage: text,
      });

      setText("");
      setImages([]);
      setFiles([]);
    } else {
      toast.error("Please select an user to send message!");
    }
  };

  //Create new chats and user chat
  const createChat = async (callback) => {
    try {
      //Create chats with empty messages
      await setDoc(doc(db, "chats", data.chatId), {
        messages: [],
      });

      //create current user chat
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".userInfo"]: {
          uid: data.user.uid,
          userName: data.user.userName,
          photoURL: data.user.photoURL,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      //create selected user chats
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".userInfo"]: {
          uid: currentUser.uid,
          userName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      callback();
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async () => {
    if (images.length) {
      const imageUrls = await uploadFiles(images);
      console.log("imageUrls:", imageUrls);

      //Update document in chats collection
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          imageUrls,
        }),
      });
    } else if (files.length) {
      const filesUrls = await uploadFiles(files, "attachments");
      console.log("filesUrls:", filesUrls);

      //Update document in chats collection
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          filesUrls,
        }),
      });
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
        [data.chatId + ".removed"]: false,
        [data.chatId + ".date"]: serverTimestamp(),
      });

      console.log("selected user currentUser.uid: ", currentUser.uid);
      console.log("selected user data.user.uid: ", data.user.uid);

      //Update user's userChats last message
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
          text,
        },
        [data.chatId + ".removed"]: false,
        [data.chatId + ".date"]: serverTimestamp(),
      });
    } catch (error) {
      console.log("Update userChats error", error);
    }
  };

  //On press enter in input
  const handleKey = (e) => {
    e.code === "Enter" && handleSend();
  };

  //Store Images to state
  const handleImageSelect = (e) => {
    setProgress(0);
    const selectedImages = Array.from(e.target.files).filter((file) =>
      file.type.startsWith("image/")
    );
    setImages([...selectedImages]);

    selectedImages.forEach((file) => {
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        setImagesURL((prevImages) => [...prevImages, reader.result]);
      });

      reader.readAsDataURL(file);
    });
    console.log("allImages:", [...imagesURL]);
  };

  //Store Files to state
  const handleFileSelect = (e) => {
    setProgress(0);
    const selectedFiles = Array.from(e.target.files);
    setFiles([...selectedFiles]);

    selectedFiles.forEach((file) => {
      const fileName = file.name;
      const extension = fileName.substring(fileName.lastIndexOf(".") + 1);
      setFilenames((files) => [...files, `${fileName}`]);
    });
  };

  return (
    <>
      <div>
        {data.chatId != "null" && (
          <div className="input-container">
            {[...imagesURL].length > 0 && (
              <div>
                <ProgressBar now={progress} label={`${progress}%`} />
                <div className="image-preview">
                  {[...imagesURL].map((img, i) => (
                    <img src={img} key={i} />
                  ))}
                </div>
              </div>
            )}
            {[...filenames].length > 0 && (
              <div>
                <ProgressBar now={progress} label={`${progress}%`} />
                <div className="image-preview">
                  {[...filenames].map((filename, i) => (
                    <p key={i}>
                      {filename}
                      {[...filenames].length > 1 &&
                        i != [...filenames].length - 1 &&
                        ","}
                    </p>
                  ))}
                </div>
              </div>
            )}
            <div className="messageInput">
              <input
                type={"file"}
                multiple
                style={{ display: "none" }}
                id="attachments"
                onChange={handleFileSelect}
              />
              <label htmlFor="attachments">
                <MdAttachment size={20} color="#C3CAD9" />
              </label>
              <input
                type={"file"}
                multiple
                style={{ display: "none" }}
                id="file"
                onChange={handleImageSelect}
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
          </div>
        )}
      </div>
    </>
  );
};

export default Input;
