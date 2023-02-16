import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  //Scroll to bottom when user send message
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  });

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
