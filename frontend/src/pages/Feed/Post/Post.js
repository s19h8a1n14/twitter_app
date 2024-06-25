import React from "react";
import { Avatar } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";
import UseLoggedInUser from "../../../hooks/UseLoggedInUser";
import "./Post.css";

const Post = ({ p }) => {
  const { profilePhoto, name, username, post, image, video } = p;
  const [loggedInUser] = UseLoggedInUser();
  const subscribed = loggedInUser[0]?.subscription;
  const plan = loggedInUser[0]?.isSubscribed;

  return (
    <div className="post">
      <div className="post_avatar">
        <Avatar src={profilePhoto} />
      </div>
      <div className="post_body">
        <div>
          <div className="post_headerText">
            <h3>
              {name}{" "}
              <span className="post_headerSpecial">
                {subscribed && <VerifiedIcon className={`post_badge_${plan}`} />} @{username}
                {/* {subscribed && <VerifiedIcon className="post_badge" />} @{username} */}
                {/* <VerifiedIcon className="post_badge" /> @{username} */}
              </span>
            </h3>
          </div>
          <div className="post_headerDescription">
            <p>{post}</p>
          </div>
        </div>
        {image && <img src={image} alt="" />}
        {video && <video src={video} controls></video>}

        <div className="post_footer">
          <ChatBubbleOutlineIcon fontSize="small" />
          <RepeatIcon fontSize="small" />
          <FavoriteBorderIcon fontSize="small" />
          <PublishIcon fontSize="small" />
        </div>
      </div>
    </div>
  );
};

export default Post;
