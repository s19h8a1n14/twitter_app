import React, { useState } from "react";
import TwitterImage from "../../assets/images/twitter.jpeg";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useCreateUserWithEmailAndPassword, useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth, db, ref, set } from "../../firebase.init";
import GoogleButton from "react-google-button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [createUserWithEmailAndPassword, user, loading, error] =  useCreateUserWithEmailAndPassword(auth);
  const [signInWithGoogle, googleUser] =  useSignInWithGoogle(auth);

  if (user || googleUser) {
    navigate("/login");
    console.log(googleUser.user.displayName);
    console.log(googleUser.user.email);
    console.log(googleUser.user.uid);
  }
  if (error) {
    console.log(error.message);
  }
  if (loading) {
    console.log("loading...");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(email, password);

    const userdata = {
      userName: userName || googleUser.user.displayName,
      name: name || googleUser.user.displayName,
      email: email || googleUser.user.email,
      password: password || googleUser.user.uid,
    };
    const { data } = axios.post("http://localhost:5000/register", userdata);
    console.log(data);
  };

  // const handleGoogleSignIn = async () => {
  //   try {
  //     // await signInWithGoogle();
  //     const response = await signInWithGoogle();
  //     console.log(response);
  //     const uid = response.user.uid;
  //     const email = response.user.email;
  //     const displayName = response.user.displayName;
  //     console.log(uid);
  //     const userRef = ref(db, 'users/' + uid);
  //     await set(userRef, {
  //       uid: uid,
  //       email: email,
  //       displayName: displayName
  //     });
  //   } catch (error) {
  //     console.error("Error signing in with Google", error);
  //   }
  // };
   
  const handleGoogleSignIn = async () => {
    try {
      const response= await signInWithGoogle();
      console.log(response);
      const userData = {
        userName:response.user.displayName,
        name: response.user.displayName,
        email:response.user.email,
        password: response.user.uid,
      };
      const uid = response.user.uid;
      const Email = response.user.email;
      const displayName = response.user.displayName;
      const userRef = ref(db, 'users/' + uid);
          await set(userRef, {
            uid: uid,
        email: Email,
        displayName: displayName
          });
      const { data } = await axios.post("http://localhost:5000/register", userData);
      console.log(data);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  return (
    <div className="login-container">
      <div className="image-conatiner">
        <img className="image" src={TwitterImage} alt="twitter" />
      </div>
      <div className="form-container">
        <div className="form-box">
          <TwitterIcon className="Twittericon" style={{ color: "skyblue" }} />
          <h2 className="heading">Happening Now</h2>
          <h3 className="heaiding1">Join Twitter today</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="display-name"
              placeholder="@username"
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="text"
              className="display-name"
              placeholder="Enter full name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              className="email"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="btn-login">
              <button type="submit" className="btn">
                Signup
              </button>
            </div>
          </form>
          <hr />
          <div className="google-button">
            <GoogleButton
              className="g-btn"
              type="light"
              onClick={handleGoogleSignIn}
            />
          </div>
          <div>
            Already have an account?
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "skyblue",
                fontWeight: "600",
                marginLeft: "5px",
              }}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

};
export default Signup;
