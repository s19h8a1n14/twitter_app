import React, { useState, useEffect } from "react";
import TweetBox from "./TweetBox/TweetBox";
import Post from "./Post/Post";
import LanguageChanger from "./LanguageChanger";
import "./Feed.css";
import { useTranslation } from "react-i18next";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetch("http://localhost:5000/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      });
  }, [posts]);


  return (
  
    <div className="feed">
      <div className="feed__header">
        <h2>{t("Home")}</h2>
        <LanguageChanger />
      </div>
      <TweetBox />
      {posts.map((p) => (
        <Post key={p._id} p={p} />
      ))}
    </div>

  );
};

export default Feed;
