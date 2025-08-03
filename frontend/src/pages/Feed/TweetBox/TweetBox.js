import React, { useState, useEffect } from "react";
import { Avatar, Button, Modal, Box, TextField } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import axios from "axios";
import UseLoggedInUser from "../../../hooks/UseLoggedInUser";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../firebase.init";
import { useTranslation } from "react-i18next";
import { useToast } from "@chakra-ui/react";
import Snackbar from "@mui/material/Snackbar";
import { Link } from "react-router-dom";
import API_CONFIG from "../../../config/api";
import "./TweetBox.css"; // Assuming the styles are saved in a TweetBox.css file

const TweetBox = () => {
  const [post, setPost] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState(" ");
  const [loggedInUser] = UseLoggedInUser();
  const [user] = useAuthState(auth);
  const email = user?.email;
  const { t } = useTranslation();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState("");
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  const [otp4, setOtp4] = useState("");
  const [openModal, setOpenModal] = useState(false);

  // For otp verification
  const [otp, setOtp] = useState("");

  const userProfilePic = loggedInUser[0]?.profileImage
    ? loggedInUser[0]?.profileImage
    : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";

  const subscribed = loggedInUser[0]?.subscription;
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (user?.providerData[0].providerId === "password") {
      fetch(`${API_CONFIG.BASE_URL}/loggedInUser?email=${email}`)
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

  const handleTweet = async (e) => {
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
        upvotes: [],
        likes: [],
        retweets: [],
        bookmarks: [],
        subscribed: subscribed,
      };

      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/posts`,
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(userPost),
          }
        );
        const data = await response.json();
        if (data.error === "Daily post limit reached") {
          setDesc("Daily post limit reached");
          setOpen(true);
        }
      } catch (error) {
        console.error("Error posting tweet:", error);
      } finally {
        setIsLoading(false);
        setPost("");
        setImageURL("");
        setVideoURL("");
      }
    }
  };

  const handleUploadImage = async (e) => {
    setImageLoading(true);
    const image = e.target.files[0];

    const formData = new FormData();
    formData.set("image", image);
    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${API_CONFIG.IMGBB_API_KEY}`,
        formData
      );
      setImageURL(res.data.data.display_url);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setImageLoading(false);
    }
  };

  const MAX_VIDEO_SIZE = 1024000000;
  const MAX_VIDEO_DURATION = 1000 * 60 * 60 * 60;

  const handleUploadVideo = (e) => {
    e.preventDefault();
    const video = e.target.files[0];

    if (!video) {
      alert("No video file selected");
      return;
    }
    console.log(video.size);
    if (!subscribed && video.size > MAX_VIDEO_SIZE) {
      setDesc("Video size exceeds maximum limit.");
      setOpen(true);
      return;
    }

    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";

    videoElement.onloadedmetadata = () => {
      window.URL.revokeObjectURL(videoElement.src);
      const duration = videoElement.duration;

      if (duration > MAX_VIDEO_DURATION) {
        alert("Video exceeds maximum duration limit.");
        return;
      }
      const uploadedVideo = video;
      requestOTPAndUploadVideo();
    };

    videoElement.onerror = () => {
      alert("Failed to load video metadata. Please try another file.");
    };

    videoElement.src = URL.createObjectURL(video);
  };

  // Function to send OTP
  const sendOTP = (email) => {
    setOtp1("");
    setOtp2("");
    setOtp3("");
    setOtp4("");
    return axios.post(`${API_CONFIG.BASE_URL}/sendotp`, { email });
  };

  // Function to verify OTP and upload video
  const verifyOTPAndUploadVideo = () => {
    const userEmail = email;
    const otp = otp1 + otp2 + otp3 + otp4;
    console.log(otp);
    return axios
      .post(`${API_CONFIG.BASE_URL}/verify`, {
        otp,
        email: userEmail,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data === "Verified") {
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

  // Function to upload video
  const uploadVideo = () => {
    setVideoLoading(true);
    const data = new FormData();
    const video = document.getElementById("video").files[0];
    data.append("file", video);
    data.append("upload_preset", "twitter");
    data.append("cloud_name", "dastry4d");

    return axios
      .post("https://api.cloudinary.com/v1_1/dastry4d/video/upload", data)
      .then((res) => {
        setVideoURL(res.data.url.toString());
        console.log(res.data.url.toString());
        setVideoLoading(false);

        const videoData = {
          url: res.data.url.toString(),
        };

        return fetch(`${API_CONFIG.BASE_URL}/videos`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(videoData),
        })
          .then((response) => response.json())
          .then((res) => {
            console.log("Video uploaded and upvoted:", res);
          })
          .catch((err) => {
            console.error("Error saving video:", err);
            alert("Error saving video. Please try again.");
          });
      })
      .catch((err) => {
        console.log(err);
        setVideoLoading(false);
      });
  };

  // Updated function to request OTP and upload video
  const requestOTPAndUploadVideo = () => {
    const userEmail = email;
    sendOTP(userEmail)
      .then((otpResponse) => {
        console.log(otpResponse.data);
        setOpenModal(true);
      })
      .catch((err) => {
        console.error("Error requesting OTP:", err);
        alert("Failed to request OTP. Please try again later.");
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
    marginRight: "8px", // Add right margin between text fields
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
        <Button onClick={verifyOTPAndUploadVideo}>Verify OTP</Button>
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
        <div className="tweet_upload">
          <div className="upload">
            <div className="imageIcon_tweetButton">
              <label htmlFor="image" className="imageIcon">
                {imageLoading ? (
                  <p>{t("Loading...")}</p>
                ) : (
                  <p>
                    {imageURL ? (
                      t("Image uploaded")
                    ) : (
                      <AddPhotoAlternateOutlinedIcon />
                    )}
                  </p>
                )}
              </label>
              <input
                type="file"
                id="image"
                className="imageInput"
                onChange={handleUploadImage}
              />
            </div>
            <div className="imageIcon_tweetButton">
              <label htmlFor="video" className="imageIcon">
                {videoLoading ? (
                  <p>{t("Loading...")}</p>
                ) : (
                  <p>{videoURL ? t("Video uploaded") : <VideoCallIcon />}</p>
                )}
              </label>
              <input
                type="file"
                id="video"
                accept="video/*"
                className="imageInput"
                onChange={handleUploadVideo}
              />
            </div>
          </div>
          <Button
            className="tweetBox__tweetButton"
            type="submit"
            disabled={isLoading}
          >
            {t("Tweet")}
          </Button>
        </div>
      </form>
      <Link to="/home/subscribe">
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
