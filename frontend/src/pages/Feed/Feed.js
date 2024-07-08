import React, { useState, useEffect } from "react";
import TweetBox from "./TweetBox/TweetBox";
import Post from "./Post/Post";
import LanguageChanger from "./LanguageChanger";
import "./Feed.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase.init";
import { useTranslation } from "react-i18next";
import RewardPoints from "./RewardPoints";
// import { set } from "mongoose";

const Feed = () => {
  const [user] = useAuthState(auth);
  const email = user?.email;
  const [posts, setPosts] = useState([]);
  const [points, setPoints] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetch("http://localhost:5000/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      });
  }, [posts]);

  useEffect(() => {
    fetch(`http://localhost:5000/userStatus?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        setPoints(data.Points);
        setIsSubscribed(data.isSubscribed);
      });
  }, [email]);


  return (

    <div className="feed">
      <div className="feed__header">
        <h2>{t("Home")}</h2>
        <div className="feed_right">
          <LanguageChanger />
          <RewardPoints />
        </div>
       
      </div>
      <TweetBox />
      {posts.map((p) => (
        <Post key={p._id} p={p} />
      ))}
    </div>

  );
};

export default Feed;
