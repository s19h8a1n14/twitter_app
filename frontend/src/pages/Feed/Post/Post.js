import React from "react";
import { Avatar } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PublishIcon from "@mui/icons-material/Publish";
import "./Post.css";
import UseLoggedInUser from "../../../hooks/UseLoggedInUser";
import auth from "../../../firebase.init";

const Post = ({ p }) => {
  const { name, username, image, video, post, profilePhoto } = p;
  const [loggedInUser] = UseLoggedInUser();
  const subscribed = loggedInUser[0]?.subscription;
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
          <ChatBubbleOutlineIcon fontSize="small" />
          <RepeatIcon fontSize="small" />
          <FavoriteBorderIcon fontSize="small" />
          {/* <PublishIcon fontSize="small" /> */}
        </div>
      </div>
    </div>
  );
};

export default Post;
