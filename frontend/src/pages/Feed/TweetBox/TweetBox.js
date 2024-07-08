import React, { useState, useEffect } from "react";
import { Avatar, Button, Modal, Box, TextField } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import VideoCameraBackOutlinedIcon from '@mui/icons-material/VideoCameraBackOutlined';
import UseLoggedInUser from "../../../hooks/UseLoggedInUser";
import Snackbar from "@mui/material/Snackbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase.init";
import axios from "axios";
import "./TweetBox.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";



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
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  const [otp4, setOtp4] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const MAX_VIDEO_SIZE = 1000000000;
  const MAX_VIDEO_DURATION = 60 * 60;
  const subscribed = loggedInUser[0]?.isSubscribed;
  const userProfilePic = loggedInUser[0]?.profileImage ? loggedInUser[0]?.profileImage : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";
  const navigate = useNavigate();
  const [postCount, setPostCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(0);
  const [subscriptionType, setSubscrtiptonType] = useState(" ");
  const [subscriptionExpiry, setSubscrtiptonExpiry] = useState(Date.now());
  const [likes, setLikes] = useState(0);
  const [saved, setSaved] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/userStatus?email=${email}`);
        const data = await response.json();
        // console.log(data);
        setPostCount(data.postCount);
        setLikes(data.Likes);
        setSaved(data.isSaved);
        setIsSubscribed(data.isSubscribed);
        setSubscrtiptonType(data.subscriptionType);
        setSubscrtiptonExpiry(data.subscriptionExpiry);
      }
      catch (error) {
        console.log("Error in fetching data", error);
      }
    };
    const interval = setInterval(fetchData, 10000000000);

    return () => {
      clearInterval(interval);
    };
  }, [email]);


  const handleCloseSnackbar = () => {
    setOpen(false);
  };

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
        Likes: 0,
        saved: 0,
      };
      setIsLoading(false);
      setPost("");
      setImageURL("");
      setVideoURL("");
      axios.post("http://localhost:5000/posts", userPost)
        .then((response) => {
          console.log(response.data);
          if(response.data.error==="Limit Reached")
          {
            alert("Your daily post limit is reached. Please subscribe to post more.");
            navigate("/home/Premium");
          }
        })
        .catch((error) => {
          console.error(error);
        });
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

        const imagedata = { url: res.data.data.display_url.toString() };
        fetch("http://localhost:5000/images", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(imagedata),
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log("error in upload image", error);
          });
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
      console.log("Video is too large");
      return;
    }

    const videoEle = document.createElement("video");
    videoEle.preload = "metadata";

    videoEle.onloadedmetadata = () => {
      window.URL.revokeObjectURL(videoEle.src);
      if (videoEle.duration > MAX_VIDEO_DURATION) {
        console.log("Video is too long");
        return;
      }
      SentOtp();
    }
    videoEle.onerror = () => {
      console.log("Can't load video");
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
      });
  };

  const verifyOTP = () => {
    const userEmail = email;
    const otp = otp1 + otp2 + otp3 + otp4;
    return axios.post("http://localhost:5000/verifyotp", { otp: otp, email: userEmail })
      .then((res) => {
        console.log(res.data);
        if (res.data === "verified") {
          setOpenModal(false);
          setOpen(true);
          return uploadVideo();
        } else {
          console.log("Invalid OTP. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Error verifying OTP:", err);

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
          });
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
    width: 380,
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "20px",
  };


  const inputContainerStyle = {
    display: "flex",
    alignitems: "center",
    justifyContent: "center"
  };

  const inputStyle = {
    marginRight: "10px",
    width: "50px",
    borderRadius: "5px",
    border: "1px solid #000",
  };

  const buttonstyle = {
    textAlign: "center",
    border: "1px solid #000",
    borderRadius: "30px",
    marginLeft: "110px",

  };

  const handleOpen = () => {
    document.getElementById("otp1").focus();
  };

  const handleOtpChange = (setter, nextInputId, prevInputId, event) => {
    const value = event.target.value.slice(0, 1);
    setter(value);
    if (value && nextInputId) {
      document.getElementById(nextInputId).focus();
    } else if (!value && prevInputId && event.code === "Backspace") {
      document.getElementById(prevInputId).focus();
    }
  };

  const otpModal = (
    <Modal
      open={openModal}
      onOpen={() => handleOpen()}
      onClose={() => setOpenModal(false)}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box sx={modalStyle}>
        <h2 id="parent-modal-title" style={{ textAlign: "center" }}>{t("OTP Verification")}</h2>
        <p id="parent-modal-description" style={{ padding: "15px" }}>
          {t("code has been sent to you : ")}
          {user.email.slice(0, 3) + "*****" + user.email.slice(13, user.email.length)}
        </p>
        <div className="otpField" style={inputContainerStyle}>
          <TextField
            style={inputStyle}
            id="otp1"
            value={otp1}
            onChange={(e) => handleOtpChange(setOtp1, "otp2", null, e)}
          />
          <TextField
            style={inputStyle}
            id="otp2"
            value={otp2}
            onChange={(e) => {
              setOtp2(e.target.value.slice(0, 1));
              const value = e.target.value.slice(0, 1);
              //setter(value);
              if (value && "otp3") {
                document.getElementById("otp3").focus();
              } else if (!value && "otp1" && e.which === "Backspace") {
                document.getElementById("otp1").focus();
              }
            }}
          />
          <TextField
            style={inputStyle}
            id="otp3"
            value={otp3}
            onChange={(e) => handleOtpChange(setOtp3, "otp4", "otp2", e)}
          />
          <TextField
            style={inputStyle}
            id="otp4"
            value={otp4}
            onChange={(e) => handleOtpChange(setOtp4, null, "otp3", e)}
          />
        </div>
        <p id="parent-modal-description" style={{ textAlign: "center" }}>
          {t("didn't receive the code?")}
          <Button onClick={SentOtp}>{t("Resend")}</Button>
        </p>
        <Button onClick={verifyOTP} style={buttonstyle}>{t("Verify OTP")}</Button>
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
            placeholder={t("What is happening?!")}
            onChange={(e) => setPost(e.target.value)}
            value={post}
            required
          />
        </div>
        {postCount > 9 && !isSubscribed ? (
          <div style={{ display: 'flex' }}>
            <p style={{ color: 'red' }}>{t("limitReached")}</p>
          </div>
        ) : null}
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
      {otpModal}
      < Snackbar
        open={open}
        autoHideDuration={10000}
        onClose={handleCloseSnackbar}
        message={t("OTP verified successfully!")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </div>

  );
};

export default TweetBox;
