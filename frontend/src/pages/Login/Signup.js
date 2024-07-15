import React, { useState, useEffect } from "react";
import TwitterImage from "../../assets/images/twitter.png";
import TwitterIcon from "@mui/icons-material/Twitter";
import XIcon from "@mui/icons-material/X";
import auth from "../../firebase.init";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import GoogleButton from "react-google-button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);

  useEffect(() => {
    if (user || googleUser) {
      const currentUser = user || googleUser.user;
      // console.log(currentUser.user.email);
      // console.log(currentUser.displayName);
      // console.log(currentUser.email);

      const userData = {
        userName: userName || currentUser.user.displayName,
        name: name || currentUser.user.displayName,
        email: currentUser.user.email,
        points: 0,
        subscription: false,
      };
      axios
        .post("https://twitter-1-8ggt.onrender.com/register", userData)
        .then(() => {
          navigate("/");
        });
    }
  }, [user, googleUser]);

  if (user || googleUser) {
    navigate("/");
    console.log(user);
    console.log(googleUser);
  }
  if (error) {
    console.log(error.message);
  }
  if (loading) {
    console.log("loading...");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    createUserWithEmailAndPassword(email, password);

    // let points = 0;
    // let subscription = false;

    // const user = {
    //   userName: userName,
    //   name: name,
    //   email: email,
    //   points: points,
    //   subscription: subscription,
    // };
    // const { data } = axios.post("https://twitter-1-8ggt.onrender.com/register", user);
    // console.log(data);
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle();
  };

  return (
    <div className="login-container">
      <div className="image-conatiner">
        <img className="image" src={TwitterImage} alt="twitter" />
      </div>
      <div className="form-container">
        <div className="form-box">
          <XIcon className="Twittericon" style={{ color: "black" }} />
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
