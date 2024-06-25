import React, { useState } from "react";
import TwitterImage from "../../assets/images/twitter.jpeg";
import TwitterIcon from "@mui/icons-material/Twitter";
import {
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { auth, db, ref, set } from "../../firebase.init";
import GoogleButton from "react-google-button";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const [signInWithGoogle, googleUser] =
    useSignInWithGoogle(auth);

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
    signInWithEmailAndPassword(email, password);
  };

  // const handleGoogleSignIn = () => {
  //   signInWithGoogle();
  // };



  const handleGoogleSignIn = async () => {
    try {
      // await signInWithGoogle();
      const response = await signInWithGoogle();
      console.log(response);
      const uid = response.user.uid;
      const email = response.user.email;
      const displayName = response.user.displayName;
      console.log(uid);
      const userRef = ref(db, 'users/' + uid);
      await set(userRef, {
        uid: uid,
        email: email,
        displayName: displayName
      });
    } catch (error) {
      // console.error("Error signing in with Google", error);
      alert("Error signing in with Google");

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
    </div>
  );
};

export default Login;
