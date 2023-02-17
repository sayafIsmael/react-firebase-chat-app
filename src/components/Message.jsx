import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { Unsend } from "./Unsend";

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
                <img src={image} alt="" key={i} />
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
