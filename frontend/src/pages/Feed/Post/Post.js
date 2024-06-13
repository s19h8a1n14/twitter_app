import React, { useState, useEffect } from "react";
import { Avatar, Button } from "@mui/material";
import ButtonBase from "@mui/material/ButtonBase";
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
import { useNavigate } from "react-router-dom";

const Post = ({ p }) => {
  const {
    name,
    username,
    image,
    video,
    post,
    profilePhoto,
    upvotes,

    retweets,
  } = p;
  const [loggedInUser] = UseLoggedInUser();
  const subscribed = loggedInUser[0]?.subscription;
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasRetweeted, setHasRetweeted] = useState(false);
  const navigate = useNavigate();

  const handleUpvote = async (e) => {
    e.stopPropagation();
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
    } catch (error) {
      console.error("Error:", error);
    }
    setHasUpvoted(!hasUpvoted);
  };

  const handleLikes = async (e) => {
    e.stopPropagation();
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
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
    setHasLiked(!hasLiked);
  };

  const handleRetweets = async (e) => {
    e.stopPropagation();
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
    } catch (error) {
      console.error("Error:", error);
    }
    setHasRetweeted(!hasRetweeted);
  };

  const formattedDate = new Date(p.createdAt).toLocaleDateString();
  const formattedTime = new Date(p.createdAt).toLocaleTimeString();

  const navigateTo = () => {
    navigate(`/post/${p._id}`);
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
        <span className="post_date">{`${formattedDate} at ${formattedTime}`}</span>
        <div className="post_footer">
          <div className="post_footerItem">
            <ChatBubbleOutlineIcon fontSize="small" />
            <span>0</span>
          </div>
          <div className="post_footerItem">
            <RepeatIcon
              fontSize="small"
              onClick={(e) => handleRetweets(e)}
              style={{ color: hasRetweeted ? "grey" : "green" }}
            />
            <span>{p?.retweets?.length}</span>
          </div>
          <div className="post_footerItem">
            <FavoriteBorderIcon
              fontSize="small"
              style={{ color: hasLiked ? "grey" : "red" }}
              onClick={(e) => handleLikes(e)}
            />
            <span>{p?.likes?.length}</span>
          </div>
          <div className="post_footerItem">
            <ThumbUpIcon
              fontSize="small"
              style={{ color: hasUpvoted ? "grey" : "blue" }}
              onClick={(e) => handleUpvote(e)}
            />
            <span>{p?.upvotes?.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
