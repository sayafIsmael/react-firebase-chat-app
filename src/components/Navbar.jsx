import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { useRouter } from 'next/router'

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const router = useRouter();

  // console.log("current user navbar:", currentUser);

  return (
    <div className="navbar">
      <span>App</span>
      <div className="user">
        <img src={currentUser?.photoURL} alt="" />
        <span>{currentUser?.displayName}</span>
        <button onClick={() => {
          signOut(auth);
          dispatch({
            type: "CHANGE_USER",
            payload: {},
            chatId: "null",
          });
          router.push("/login")
          }}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
