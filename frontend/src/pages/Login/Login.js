import React, { useState, useEffect } from "react";
import TwitterImage from "../../assets/images/twitter.png";
import XIcon from "@mui/icons-material/X";
import {
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import GoogleButton from "react-google-button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);

  if (user || googleUser) {
    // navigate("/");
    console.log(user);
    console.log(googleUser);
  }

  // useEffect(() => {
  //   // fetch from router /time
  //   axios.get("https://twitter-1-8ggt.onrender.com/time").then((res) => {
  //     if (res.data === "Access granted") {
  //     } else {
  //       setOpen(true);
  //       // console.log(res.data);
  //     }
  //   });
  // }, []);

  useEffect(() => {
    if (user || googleUser) {
      const currentUser = user || googleUser.user;
      const userData = {
        email: currentUser.email,
      };
      axios
        .post("https://twitter-1-8ggt.onrender.com/login", userData)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            navigate("/home/feed");
          } else {
            console.error("Failed to login");
          }
        })
        .catch((err) => {
          setOpen(true);
          console.error("Error logging in:", err);
          setErrorMessage(
            err.response ? err.response.data : "An error occurred"
          );
        });
    }
  }, [user, googleUser, navigate]);

  if (error) {
    console.log(error.message);
  }
  if (loading) {
    console.log("loading...");
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    signInWithEmailAndPassword(email, password);
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
                Login
              </button>
            </div>
            <hr />
            <div className="google-button">
              <GoogleButton
                className="g-btn"
                type="light"
                onClick={handleGoogleSignIn}
              />
            </div>
            <div>
              Don't have an account?
              <Link
                to="/signup"
                style={{
                  textDecoration: "none",
                  color: "skyblue",
                  fontWeight: "600",
                  marginLeft: "5px",
                }}
              >
                Signup
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message="Mobile devices can only login between 9 am and 5pm"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </div>
  );
};

export default Login;
