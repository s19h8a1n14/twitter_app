import React, { useState, useEffect } from "react";
import { Avatar, Button } from "@mui/material";
import ButtonBase from "@mui/material/ButtonBase";
import VerifiedIcon from "@mui/icons-material/Verified";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
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
    subscribed,
    retweets,
  } = p;
  const [loggedInUser] = UseLoggedInUser();
  const email = loggedInUser[0]?.email;

  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasRetweeted, setHasRetweeted] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const subscription = loggedInUser[0]?.subscription;

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(
          `https://twitter-1-8ggt.onrender.com/userId?email=${email}`
        );
        if (response.ok) {
          const data = await response.json();
          setUserId(data.userId);
        } else {
          console.error("Failed to fetch user ID");
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    if (email) {
      fetchUserId();
    }
  }, [email]);

  const handleUpvote = async (e) => {
    e.stopPropagation();

    try {
      const response = await fetch(
        `https://twitter-1-8ggt.onrender.com/posts/${p._id}/upvote?email=${email}`,
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
    //console.log(subscribed);
    try {
      const response = await fetch(
        `https://twitter-1-8ggt.onrender.com/posts/${p._id}/like?email=${email}`,
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

  const handleBookmarks = async (e) => {
    e.stopPropagation();
    //console.log(subscribed);
    try {
      const response = await fetch(
        `https://twitter-1-8ggt.onrender.com/posts/${p._id}/bookmark`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
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
    setHasBookmarked(!hasBookmarked);
  };

  const handleRetweets = async (e) => {
    e.stopPropagation();
    //console.log(subscribed);
    try {
      const response = await fetch(
        `https://twitter-1-8ggt.onrender.com/posts/${p._id}/retweet?email=${email}`,
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

  const Bookmarks = () => {
    if (p?.bookmarks?.length > 0) {
      return p?.bookmarks.find((bookmark) => bookmark === userId) ? (
        <>
          <BookmarkIcon fontSize="small" style={{ color: "blue" }} />
          &nbsp;{p?.bookmarks?.length}
        </>
      ) : (
        <>
          <BookmarkIcon fontSize="small" style={{ color: "grey" }} />
          &nbsp;{p?.bookmarks?.length}
        </>
      );
    }

    return <BookmarkIcon fontSize="small" style={{ color: "grey" }} />;
  };

  const Retweets = () => {
    if (p?.retweets?.length > 0) {
      return p?.retweets.find((retweet) => retweet === userId) ? (
        <>
          <RepeatIcon fontSize="small" style={{ color: "green" }} />
          &nbsp;{p?.retweets?.length}
        </>
      ) : (
        <>
          <RepeatIcon fontSize="small" style={{ color: "grey" }} />
          &nbsp;{p?.retweets?.length}
        </>
      );
    }

    return <RepeatIcon fontSize="small" style={{ color: "grey" }} />;
  };

  const Likes = () => {
    if (p?.likes?.length > 0) {
      return p?.likes.find((like) => like === userId) ? (
        <>
          <FavoriteIcon fontSize="small" style={{ color: "red" }} />
          &nbsp;{p?.likes?.length}
        </>
      ) : (
        <>
          <FavoriteBorderIcon fontSize="small" style={{ color: "grey" }} />
          &nbsp;{p?.likes?.length}
        </>
      );
    }

    return <FavoriteBorderIcon fontSize="small" style={{ color: "grey" }} />;
  };

  const Upvotes = () => {
    if (p?.upvotes?.length > 0) {
      return p?.upvotes.find((like) => like === userId) ? (
        <>
          <ThumbUpIcon fontSize="small" style={{ color: "orange" }} />
          &nbsp;{p?.upvotes?.length}
        </>
      ) : (
        <>
          <ThumbUpIcon fontSize="small" style={{ color: "grey" }} />
          &nbsp;{p?.upvotes?.length}
        </>
      );
    }

    return <ThumbUpIcon fontSize="small" style={{ color: "grey" }} />;
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
                {subscription && <VerifiedIcon className="post_badge" />} @
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
              maxHeight: "200px", // Ensure the video does not take the entire screen
              width: "100%",
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

          <Button onClick={(e) => handleRetweets(e)}>
            <Retweets />
          </Button>

          <Button onClick={(e) => handleLikes(e)}>
            <Likes />
          </Button>

          <Button onClick={(e) => handleBookmarks(e)}>
            <Bookmarks />
          </Button>

          <Button onClick={(e) => handleUpvote(e)}>
            <Upvotes />
          </Button>

          {/* <div className="post_footerItem">
            <ThumbUpIcon
              fontSize="small"
              style={{ color: hasUpvoted ? "grey" : "blue" }}
              onClick={(e) => handleUpvote(e)}
            />
            <span>{p?.upvotes?.length}</span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Post;
