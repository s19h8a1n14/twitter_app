import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import Post from "../Feed/Post/Post";
import "../Page.css";

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
      {posts.map((p) => (
        <Post id={p._id} p={p} />
      ))}
    </div>
  );
};

export default Bookmarks;
