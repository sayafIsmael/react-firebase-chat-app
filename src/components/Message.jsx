import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { Unsend } from "./Unsend";
import { MdDownloadForOffline } from "react-icons/md";
import axios from "axios";

const Message = ({ message, index }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [canUnsend, setCanUnsend] = useState(false);
  const ref = useRef();

  //Scroll to bottom when user send message
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  });

  //Check if user can unsend a message
  const checkUserCanUnsend = (message) => {
    // Convert server timestamp to JavaScript Date object
    const serverDate = message.date.toDate();
    // Get current time
    const currentTime = Date.now();
    if (message.senderId === currentUser.uid) {
      if (Math.abs(serverDate.getTime() - currentTime) <= 30000) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

  // Function to download a file from a URL (as described in my previous answer)
  function downloadFile(url, filename) {
    axios({
      method: "get",
      url: url,
      responseType: "blob",
    })
      .then((response) => {
        // Handle the downloaded file
        const file = new File([response.data], filename);

        // Create a download link
        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(file);
        downloadLink.download = file.name;

        // Simulate a click on the download link
        downloadLink.click();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
      </div>
      <div className="userInfo">
        <p>
          <span>
            {message.senderId === currentUser.uid
              ? currentUser.displayName
              : data.user.userName}
          </span>{" "}
          {/* Web Designer */}{" "}
          {`${message.date.toDate().toDateString()} ${message.date
            .toDate()
            .toLocaleTimeString()}`}
        </p>
        <div className="messageContent">
          {message.senderId === currentUser.uid &&
            checkUserCanUnsend(message) && (
              <Unsend
                canUnsend={checkUserCanUnsend(message)}
                serverDate={message.date.toDate()}
                index={index}
              />
            )}
          {message.text.length > 0 && <p>{message.text}</p>}
          {message.img && <img src={message.img} alt="" />}
          {message.imageUrls && (
            <div className="images">
              {message.imageUrls.map((image, i) => (
                <div key={i}>
                  <MdDownloadForOffline
                    onClick={() =>
                      downloadFile(image.downloadURL, image.filename)
                    }
                  />
                  <img src={image.downloadURL} alt="" key={i} />
                </div>
              ))}
            </div>
          )}
          {message.filesUrls && (
            <div className="files">
              {message.filesUrls.map((file, i) => (
                <p>
                  <a href={file.url} target="_blank">
                    {file.filename}
                  </a>
                  <span>
                    <MdDownloadForOffline
                      onClick={() => downloadFile(file.url, file.filename)}
                    />
                  </span>
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
