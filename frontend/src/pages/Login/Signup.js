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
import API_CONFIG from "../../config/api";
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
      console.log("User found, registering...");
      const currentUser = user?.user || googleUser?.user;
      
      if (currentUser) {
        const userData = {
          userName: userName || currentUser.displayName?.replace(/\s+/g, '') || currentUser.email.split('@')[0],
          name: name || currentUser.displayName || currentUser.email.split('@')[0],
          email: currentUser.email,
          points: 0,
          subscription: false,
        };
        
        console.log("Sending user data:", userData);
        
        axios
          .post(`${API_CONFIG.BASE_URL}/register`, userData)
          .then((response) => {
            console.log("Registration successful:", response.data);
            navigate("/");
          })
          .catch((error) => {
            console.error("Registration error:", error);
            // If user already exists, still navigate to home
            if (error.response?.status === 400) {
              navigate("/");
            }
          });
      }
    }
  }, [user, googleUser, navigate, userName, name]);

  
  // Handle errors and loading states
  if (error) {
    console.log("Auth error:", error.message);
  }
  if (loading) {
    console.log("Loading authentication...");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Attempting signup with:", email);
    
    if (!userName || !name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }
    
    createUserWithEmailAndPassword(email, password);
  };  const handleGoogleSignIn = () => {
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
              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Creating Account..." : "Signup"}
              </button>
            </div>
          </form>
          
          {error && (
            <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
              Error: {error.message}
            </div>
          )}
          
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
