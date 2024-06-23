import React from "react";
import Sidebar from "./Sidebar/Sidebar";
import Feed from "./Feed/Feed";
import { Outlet } from "react-router-dom";
import Widgets from "./Widgets/Widgets";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase.init";
import { signOut } from "firebase/auth";
import UseLoggedInUser from "../hooks/UseLoggedInUser";
//import LanguageSelector from "./Feed/LanguageSelector";

const Home = () => {
  const user = useAuthState(auth);
  const [loggedInUser] = UseLoggedInUser();
  //console.log(loggedInUser);
  const handleLogout = () => {
    signOut(auth);
  };
  return (
    <div className="app">
      <Sidebar handleLogout={handleLogout} user={user} />

      <Outlet />
      <Widgets />
    </div>
  );
};

export default Home;
