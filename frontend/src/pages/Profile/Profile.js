import React from "react";
import "../Page.css";
import MainPage from "./MainPage/MainPage";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";

const Profile = () => {
  const [user] = useAuthState(auth);
  return (
    <div>
      <MainPage user={user} />
    </div>
  );
};

export default Profile;
