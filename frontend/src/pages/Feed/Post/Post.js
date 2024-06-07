import React, { useState, useEffect } from "react";
import { Avatar, Button } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";
import "./Post.css";
import UseLoggedInUser from "../../../hooks/UseLoggedInUser";
import auth from "../../../firebase.init";
import { use } from "i18next";

const Post = ({ p }) => {
  const {
    name,
    username,
    image,
    video,
    post,
    profilePhoto,
    upvotes,
    likes,
    retweets,
  } = p;
  const [loggedInUser] = UseLoggedInUser();
  const subscribed = loggedInUser[0]?.subscription;
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasRetweeted, setHasRetweeted] = useState(false);

  const [votes, setVotes] = useState(upvotes);
  const [like, setLike] = useState(likes);
  const [retweet, setRetweet] = useState(retweets);

  useEffect(() => {
    setVotes(p.upvotes);
  }, [hasUpvoted]);

  useEffect(() => {
    setLike(p.likes);
  }, [hasLiked]);

  useEffect(() => {
    setRetweet(p.retweets);
  }, [hasRetweeted]);

  const handleUpvote = async () => {
    if (!hasUpvoted) {
      try {
        const response = await fetch(
          `http://localhost:5000/posts/${p._id}/upvote`,
          {
            method: "PATCH",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setHasUpvoted(true);
        setVotes(p.upvotes);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      try {
        const response = await fetch(
          `http://localhost:5000/posts/${p._id}/downvote`,
          {
            method: "PATCH",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setHasUpvoted(false);
        setVotes(p.upvotes);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleLikes = async () => {
    if (!hasLiked) {
      try {
        const response = await fetch(
          `http://localhost:5000/posts/${p._id}/like`,
          {
            method: "PATCH",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setHasLiked(true);
        setLike(p.likes);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      try {
        const response = await fetch(
          `http://localhost:5000/posts/${p._id}/unlike`,
          {
            method: "PATCH",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setHasLiked(false);
        setLike(p.likes);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleRetweets = async () => {
    if (!hasRetweeted) {
      try {
        const response = await fetch(
          `http://localhost:5000/posts/${p._id}/retweet`,
          {
            method: "PATCH",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setHasRetweeted(true);
        setRetweet(p.retweets);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      try {
        const response = await fetch(
          `http://localhost:5000/posts/${p._id}/undoretweet`,
          {
            method: "PATCH",
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setHasRetweeted(false);
        setRetweet(p.retweets);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="post">
      <div className="post_avatar">
        <Avatar src={profilePhoto} />
      </div>
      <div className="post_body">
        <div className="post_header">
          <div className="post_headerText">
            <h3>
              {name}{" "}
              <span className="post_headerSpecial">
                {subscribed && <VerifiedIcon className="post_badge" />} @
                {username}
              </span>
            </h3>
          </div>
          <div className="post_headerDescription">
            <p>{post}</p>
          </div>
        </div>
        {image && (
          <img
            style={{ position: "relative", maxWidth: "100%", width: "100%" }}
            src={image}
            alt=""
          />
        )}
        {video && (
          <video
            style={{
              position: "relative",
              maxWidth: "100%",
              justifyContent: "center",
            }}
            src={video}
            controls
          ></video>
        )}

        <div className="post_footer">
          <div className="post_footerItem">
            <ChatBubbleOutlineIcon fontSize="small" />
            <span>0</span>
          </div>
          <div className="post_footerItem">
            <RepeatIcon
              fontSize="small"
              onClick={handleRetweets}
              style={{ color: hasRetweeted ? "grey" : "green" }}
            />
            <span>{retweet}</span>
          </div>
          <div className="post_footerItem" onClick={handleLikes}>
            <FavoriteBorderIcon
              fontSize="small"
              style={{ color: hasLiked ? "grey" : "red" }}
            />
            <span>{like}</span>
          </div>
          <div className="post_footerItem" onClick={handleUpvote}>
            <ThumbUpIcon
              fontSize="small"
              style={{ color: hasUpvoted ? "grey" : "blue" }}
            />
            <span>{votes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
