import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "./../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

export const Register = () => {
  const [err, setErr] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImageURL(reader.result);
    };

    reader.readAsDataURL(file);
  };

  //Submit user data and register
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const userName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    //Create User
    const res = await createUserWithEmailAndPassword(auth, email, password);

    //Create a unique image name
    const date = new Date().getTime();
    const storageRef = ref(storage, `${userName + date}`);

    console.log("authentication response:", res);

    await uploadBytesResumable(storageRef, file).then(() => {
      getDownloadURL(storageRef)
        .then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName: userName,
              photoURL: downloadURL,
            });

            //Create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              userName,
              email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});

            navigate("/");
          } catch (error) {
            setErr(error);
            setLoading(false);
            console.log(error);
          }
        })
        .catch((err) => {
          console.log("file upload error:=======>", err);
        });
    });
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="username" />
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            onChange={handleImageChange}
          />
          <label htmlFor="file">
            <img src={imageURL ? imageURL : "/add-image.png"} />
            <span>Add an avatar</span>
          </label>
          <button disabled={loading}>Sign up</button>
          {loading && <span>Please wait...</span>}
          {err && <span>Something went wrong..</span>}
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
