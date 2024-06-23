import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import Post from "../Feed/Post/Post";
import { TextField } from "@mui/material";
import "../Page.css";
import "./Bookmarks.css";

const Bookmarks = () => {
  const [posts, setPosts] = useState([]);
  const [user] = useAuthState(auth);
  useEffect(() => {
    fetch(`http://localhost:5000/userBookmarks?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      });
    //console.log(posts);
  }, [posts, user?.email]);
  return (
    <div>
      <div className="feed">
        <div>
          <h1>Bookmarks</h1>
        </div>
        <div>
          {posts.map((p) => (
            <Post id={p._id} p={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
