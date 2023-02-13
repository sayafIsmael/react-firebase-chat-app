import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  // console.log("current user navbar:", currentUser);

  return (
    <div className="navbar">
      <span>Chat app</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
