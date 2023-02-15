import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  // console.log("current user navbar:", currentUser);

  return (
    <div className="navbar">
      <span>Chat app</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button onClick={() => {
          signOut(auth);
          dispatch({
            type: "CHANGE_USER",
            payload: {},
            chatId: "null",
          });
          }}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
