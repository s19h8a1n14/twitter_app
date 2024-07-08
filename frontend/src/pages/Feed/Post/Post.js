import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import IconButton from "@mui/material/IconButton";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
// import TokenIcon from '@mui/icons-material/Token';
import UseLoggedInUser from "../../../hooks/UseLoggedInUser";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase.init";
import "./Post.css";

const Post = ({ p }) => {
  const [loggedInUser] = UseLoggedInUser();
  const [user] = useAuthState(auth);
  const email = user?.email;
  const { profilePhoto, name, username, post, image, video } = p;
  const [Likes, setLikes] = useState(p.Likes);
  const [saved, setSaved] = useState(p.saved);
  const subscribed = loggedInUser[0]?.isSubscribed;
  const plan = loggedInUser[0]?.subscriptionType;
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [LikesCount, setLikesCount] = useState(0);


  const handleLikeClick = async () => {
    // setIsLiked(!isLiked);
    if (!isLiked) {

      try {
        const response = await fetch(`http://localhost:5000/posts/${p._id}/like`, {
          method: 'PATCH'
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);

        setIsLiked(true);
        setLikes(Likes + 1);

      } catch (error) {
        console.error('There was an error!', error);
      }
    } else {

      try {
        const response = await fetch(`http://localhost:5000/posts/${p._id}/dislike`, {
          method: 'PATCH'
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        setIsLiked(false);
        setLikes(Likes - 1);
      } catch (error) {
        console.error('There was an error!', error);
      }
    }
  };
  const handleSaveClick = async () => {
    if (!isSaved) {
      try {
        const resonse = await fetch(`http://localhost:5000/posts/${p._id}/save`, {
          method: 'PATCH'
        });
        if (!resonse.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await resonse.json();
        console.log(data);
        setIsSaved(true);
        setSaved(saved + 1);
      } catch (error) {
        console.error('There was an error!', error);
      }
    }
    else {
      try {
        const resonse = await fetch(`http://localhost:5000/posts/${p._id}/unsave`, {
          method: 'PATCH'
        });
        if (!resonse.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await resonse.json();
        console.log(data);
        setIsSaved(false);
        setSaved(saved - 1);
      } catch (error) {
        console.error('There was an error!', error);
      }
    }


  };

  useEffect(() => {
    const storedLikeState = localStorage.getItem('isLiked');
    if (storedLikeState) {
      setIsLiked(JSON.parse(storedLikeState)); 
    }

    fetch(`http://localhost:5000/userStat?postid=${p._id}`)
      .then((res) => res.json())
      .then((data) => {
        setPostCount(data.postCount);
        setLikesCount(data.totalLikes);
      })
      .catch((error) => {
        console.log(error);
      });


  }, [p._id])


  const formattedDate = new Date(p.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const formattedTime = new Date(p.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="post">
      <div className="post_avatar">
        <Avatar src={profilePhoto} />
      </div>
      <div className="post_body">
        <div>
          <div className="post_headerText">
            <h3>
              {name}{"  "}
              <span className="post_headerSpecial">
                {subscribed ? <VerifiedIcon className={`post_badge_${plan}`} /> : null}
                @{username}{" . "}{formattedDate}{" at "} {formattedTime}
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
          <IconButton sx={{ color: 'black', backgroundColor: 'inherit', '&:hover': { color: 'blue', backgroundColor: '#cae2eb' } }}>
            <close id="comment"> <ChatBubbleOutlineIcon /></close>
          </IconButton>
          <IconButton sx={{ color: 'black', backgroundColor: 'inherit', '&:hover': { color: 'rgb(14, 171, 48)', backgroundColor: 'rgb(183, 225, 192)' } }}>
            <close id="repost"> <RepeatIcon /></close>
          </IconButton>
          <IconButton onClick={handleLikeClick} sx={{ color: 'black', backgroundColor: 'inherit', '&:hover': { color: '#d01b70', backgroundColor: '#f5a3c9' } }}>
            {isLiked ? <close id="unlike" style={{ color: '#d01b70' }} ><FavoriteIcon /></close> : <close id="like"><FavoriteBorderIcon /></close>}
            {Likes > 0 ? Likes : 0}
          </IconButton>
          <IconButton onClick={handleSaveClick} sx={{ color: 'black', backgroundColor: 'inherit', '&:hover': { color: '#35d889', backgroundColor: 'rgb(183, 225, 192)' } }}>
            {isSaved ? <close id="saved" style={{ color: '#35d889' }}> <BookmarkIcon /></close> : <close id="save"> <BookmarkBorderIcon /></close>}
            {saved > 0 ? saved : 0}
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Post;
