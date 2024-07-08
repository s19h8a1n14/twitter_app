import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Login/Signup";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import Home from "./pages/Home";
import Explore from "./pages/Explore/Explore";
import Feed from "./pages/Feed/Feed";
import Messages from "./pages/Messages/Messages";
import Premium from "./pages/Premium/Premium";
import Lists from "./pages/Lists/Lists";
import Profile from "./pages/Profile/Profile";
import Notifications from "./pages/Notifications/Notifications";
import Savedposts from "./pages/Savedposts/Savedposts";
import Likedposts from "./pages/Likedposts/Likedposts";
import Settings from "./pages/Settings/Settings";


import "./App.css";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<ProtectedRoutes><Home /></ProtectedRoutes>}>
          <Route index element={<Feed />} />
        </Route>

        <Route path="/home" element={<ProtectedRoutes> <Home />  </ProtectedRoutes>}>
          <Route path="feed" element={<Feed />} />
          <Route path="explore" element={<Explore />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="messages" element={<Messages />} />
          <Route path="Premium" element={<Premium />} />
          <Route path="lists" element={<Lists />} />
          <Route path="profile" element={<Profile />} />
          <Route path="savedposts" element={<Savedposts />} />
          <Route path="likedposts" element={<Likedposts />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </div>
  );
}

export default App;
