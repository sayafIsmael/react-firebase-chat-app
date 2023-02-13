import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

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
          {/* Web Designer */} {`${message.date.toDate().toDateString()} ${message.date.toDate().toLocaleTimeString()}`}
        </p>
        <div className="messageContent">
          {message.text.length > 0 && <p>{message.text}</p>}
          {message.img && <img src={message.img} alt="" />}
        </div>
      </div>
    </div>
  );
};

export default Message;
