import React, { useState,useEffect } from "react";
import { Avatar, Button, Modal, Box, TextField } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import VideoCameraBackOutlinedIcon from '@mui/icons-material/VideoCameraBackOutlined';
import UseLoggedInUser from "../../../hooks/UseLoggedInUser";
import { useAuthState } from "react-firebase-hooks/auth";
import Snackbar from "@mui/material/Snackbar";
import { Link } from "react-router-dom";
import { auth } from "../../../firebase.init";
import axios from "axios";
import "./TweetBox.css";
import { useTranslation } from "react-i18next";



const TweetBox = () => {
  const [user] = useAuthState(auth);
  const email = user?.email;
  const [post, setPost] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState(" ");
  const [loggedInUser] = UseLoggedInUser();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState("");
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  const [otp4, setOtp4] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const MAX_VIDEO_SIZE = 1000000000;
  const MAX_VIDEO_DURATION = 60 * 60;
  const subscribed = loggedInUser[0]?.subscription;
  const userProfilePic = loggedInUser[0]?.profileImage ? loggedInUser[0]?.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (user?.providerData[0].providerId === "password") {
      fetch(`http://localhost:5000/loggedInUser?email=${email}`)
        .then((res) => res.json())
        .then((data) => {
          setUsername(data[0].userName);
          setName(data[0].name);
        });
    } else {
      setUsername(email?.split("@")[0]);
      setName(user.displayName);
    }
  }, [email, user]);

  const handleTweet = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (name) {
      const userPost = {
        profilePhoto: userProfilePic,
        post: post,
        image: imageURL,
        video: videoURL,
        username: username,
        name: name,
        email: email,
      };

      console.log(userPost);
      setIsLoading(false);
      setPost("");
      setImageURL("");
      setVideoURL("");
      fetch("http://localhost:5000/posts", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(userPost),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error === "Daily post limit reached") {
            setDesc("Daily post limit reached");
            setOpen(true);
          }
          console.log(data);

        })
        .catch((error) => {
          console.log(error);
        });

      // const { data } = axios.post("http://localhost:5000/posts", userPost);
      // console.log(data);

    }
  };

  const handleUploadImage = (e) => {
    setImageLoading(true);
    const image = e.target.files[0];

    const formData = new FormData();
    formData.set("image", image);
    axios.post("https://api.imgbb.com/1/upload?key=e3ee4c500146fd3e00cd1afa8e5bc9ea", formData)
      .then((res) => {
        setImageURL(res.data.data.display_url);
        setImageLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setImageLoading(false);
      });
  };

  const handleUploadVideo = (e) => {
    e.preventDefault();
    const video = e.target.files[0];
    if (!subscribed && video.size > MAX_VIDEO_SIZE) {
      setDesc("Video size exceeds maximum limit.");
      setOpen(true);
      return;
    }

    const videoEle = document.createElement("video");
    videoEle.preload = "metadata";

    videoEle.onloadedmetadata = () => {
      window.URL.revokeObjectURL(videoEle.src);
      if (videoEle.duration > MAX_VIDEO_DURATION) {
        alert("Video is too long");
        return;
      }
      SentOtp();
    }
    videoEle.onerror = () => {
      alert("Can't load video");
    };
    videoEle.src = URL.createObjectURL(video);
  };

  const SentOtp = () => {
    const Email = email;
    setOtp1("");
    setOtp2("");
    setOtp3("");
    setOtp4("");
    axios.post("http://localhost:5000/sendotp", { email: Email })
      .then((res) => {
        setOpenModal(true);
      })
      .catch((error) => {
        console.log("error in send OTP", error);
        alert("Failed to send OTP.Please try later.");
      });
  };

  const verifyOTP = () => {
    const userEmail = email;
    const otp = otp1 + otp2 + otp3 + otp4;
    return axios.post("http://localhost:5000/verifyotp", { otp: otp , email: userEmail })
      .then((res) => {
        console.log(res.data);
        if (res.data === "verified") {
          setOpenModal(false);
          setDesc("OTP verified successfully.");
          setOpen(true);
          return uploadVideo();
        } else {
          alert("Invalid OTP. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Error verifying OTP:", err);
        alert("Failed to verify OTP. Please try again later.");
      });
  };

  const uploadVideo = () => {
    setVideoLoading(true);
    const Data = new FormData();
    const video = document.getElementById("video").files[0];
    Data.append("file", video);
    Data.append("cloud_name", "dxp2i3xim");
    Data.append("upload_preset", "TWITTER");

    axios.post("https://api.cloudinary.com/v1_1/dxp2i3xim/video/upload", Data)
      .then((res) => {
        setVideoURL(res.data.url.toString());
        setVideoLoading(false);

        const videodata = { url: res.data.url.toString() };

        fetch("http://localhost:5000/videos", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(videodata),
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log("error in upload video", error);
            alert("Failed to upload video.Please try later.");
          });
        // const { data } = axios.post("http://localhost:5000/videos", video)
        // console.log(data);

      })
      .catch((error) => {
        console.log(error);
        setVideoLoading(false);
      });

  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: "#ffffff",
    border: "2px solid #000",
    boxShadow: "0px 0px 24px rgba(0, 0, 0, 0.25)",
    padding: "16px",
  };

  const inputContainerStyle = {
    display: "flex", // Display children in a row
    justifyContent: "center", // Center-align children horizontally
  };

  const inputStyle = {
    marginRight: "8px",
    fontSize: "20px",
  };

  const otpModal = (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box sx={modalStyle}>
        <h2 id="parent-modal-title">{t("Enter OTP to Upload Video")}</h2>
        <p id="parent-modal-description">
          {t("We have sent OTP to your email:")} {user.email}
        </p>
        <div className="otpField" style={inputContainerStyle}>

          <TextField
            style={inputStyle}
            value={otp1}
            onChange={(e) => {
              setOtp1(e.target.value.slice(0, 1));
              if (e.target.value.length === 1) {
                document.getElementById("otp2").focus();
              }
            }}
          />
          <TextField
            style={inputStyle}
            id="otp2"
            value={otp2}
            onChange={(e) => {
              setOtp2(e.target.value.slice(0, 1));
              if (e.target.value.length === 1) {
                document.getElementById("otp3").focus();
              }
            }}
          />
          <TextField
            style={inputStyle}
            id="otp3"
            value={otp3}
            onChange={(e) => {
              setOtp3(e.target.value.slice(0, 1));
              if (e.target.value.length === 1) {
                document.getElementById("otp4").focus();
              }
            }}
          />
          <TextField
            style={inputStyle}
            id="otp4"
            value={otp4}
            onChange={(e) => setOtp4(e.target.value.slice(0, 1))}
          />
        </div>
        <Button onClick={verifyOTP}>Verify OTP</Button>
      </Box>
    </Modal>
  );



  return (
    <div className="tweetBox">
      <form onSubmit={handleTweet}>
        <div className="tweetBox__input">
          <Avatar src={userProfilePic} />
          <input
            type="text"
            placeholder={t("What's happening?")}
            onChange={(e) => setPost(e.target.value)}
            value={post}
            required
          />
        </div>
        <div className="side">
          <div className="imageIcon_tweetButton">
            <label htmlFor="image" className="imageIcon">
              {imageLoading ? (<p>{t("Uploading image...")}</p>) : (<p> {imageURL ? (t("Image uploaded")) : (<AddPhotoAlternateOutlinedIcon />)}</p>)}
            </label>
            <input
              type="file"
              id="image"
              className="imageInput"
              onChange={handleUploadImage}
            />
          </div>
          <div className="videoIcon_tweetButton">
            <label htmlFor="video" className="videoIcon">
              {videoLoading ? (<p>{t("Uploading video...")}</p>) : (<p>{videoURL ? t("Video uploaded") : (< VideoCameraBackOutlinedIcon />)}</p>)}
            </label>
            <input
              type="file"
              id="video"
              accept="video/*"
              className="imageInput"
              onChange={handleUploadVideo}
            />
          </div>
          <Button className="tweetBox__tweetButton" type="submit" disabled={isLoading}>
            {t("Tweet")}
          </Button>
        </div>
      </form>
      <Link to="/home/Premium">
        <Snackbar
          open={open}
          autoHideDuration={5000}
          onClose={handleClose}
          message={desc}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        />
      </Link>
      {otpModal}
    </div>
  );
};

export default TweetBox;
