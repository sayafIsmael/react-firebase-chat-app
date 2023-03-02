import React, { useState } from "react";
import Link from 'next/link'

import { useRouter } from 'next/router'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

export const Login = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  //Login user with email and password (firebase)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error) {
      setErr(true);
      console.log("login error:", error);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="passwod" />
          <button>Sign in</button>
          {loading && <span>Loading..</span>}
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          You don't have an account? <Link href="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
