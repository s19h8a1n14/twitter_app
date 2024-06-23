import React, { useState, useEffect } from "react";
import TweetBox from "./TweetBox/TweetBox";
import Post from "./Post/Post";
import LanguageSelector from "./LanguageSelector";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({});

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      });
  }, [posts]);

  return (
    <div className="feed">
      {/* <div className="feed__header">
        <LanguageSelector />
      </div> */}

      <TweetBox />

      {posts.map((p) => (
        <Post key={p._id} p={p} />
      ))}
    </div>
  );
};

export default Feed;
