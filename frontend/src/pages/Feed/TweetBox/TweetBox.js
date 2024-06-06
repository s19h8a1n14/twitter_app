import React, { useState } from "react";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import "./TweetBox.css";
import axios from "axios";
import UseLoggedInUser from "../../../hooks/UseLoggedInUser";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../firebase.init";
import { useTranslation } from "react-i18next";
import { useToast } from "@chakra-ui/toast";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer } from "react-toastify";

// Add this to your component or main app file to initialize the toast notifications
// toast.configure({ position: toast.POSITION.BOTTOM_RIGHT });

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

  const userProfilePic = loggedInUser[0]?.profileImage
    ? loggedInUser[0]?.profileImage
    : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";

  const subscribed = loggedInUser[0]?.subscription;

  const handleTweet = (e) => {
    e.preventDefault();
    if (user.providerData[0].providerId === "password") {
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
            alert("Daily post limit reached");
            toast({
              title: "Daily post limit reached",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleUploadImage = (e) => {
    setImageLoading(true);
    const image = e.target.files[0];
    console.log(image);

    const formData = new FormData();
    formData.set("image", image);
    axios
      .post(
        "https://api.imgbb.com/1/upload?key=4d85ebb9be2bdb170d589f63edf099ae",
        formData
      )
      .then((res) => {
        setImageURL(res.data.data.display_url);
        console.log(res.data.data.display_url);
        setImageLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setImageLoading(false);
      });
  };

  const MAX_VIDEO_SIZE = 1048;
  const MAX_VIDEO_DURATION = 100;

  const handleUploadVideo = (e) => {
    e.preventDefault();
    const video = e.target.files[0];

    if (!video) {
      alert("No video file selected");
      return;
    }

    if (!subscribed && video.size > MAX_VIDEO_SIZE) {
      alert("Video exceeds maximum size limit.");
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

      requestOTPAndUploadVideo(video);
    };

    videoElement.onerror = () => {
      alert("Failed to load video metadata. Please try another file.");
    };

    videoElement.src = URL.createObjectURL(video);
  };

  const requestOTPAndUploadVideo = (video) => {
    const userEmail = email;

    axios
      .post("http://localhost:5000/sendotp", { email: userEmail })
      .then((res) => {
        console.log(res.data);
        const otp = prompt("Enter OTP sent to your email:");

        axios
          .post("http://localhost:5000/verify", { otp, email: userEmail })
          .then((res) => {
            console.log(res.data);
            if (res.data === "Verified") {
              setVideoLoading(true);
              const data = new FormData();
              data.append("file", video);
              data.append("upload_preset", "twitter");
              data.append("cloud_name", "df9xugdxg");

              axios
                .post(
                  "https://api.cloudinary.com/v1_1/df9xugdxg/video/upload",
                  data
                )
                .then((res) => {
                  setVideoURL(res.data.url.toString());
                  console.log(res.data.url.toString());
                  setVideoLoading(false);

                  const video = {
                    url: res.data.url.toString(),
                  };

                  fetch("http://localhost:5000/videos", {
                    method: "POST",
                    headers: {
                      "content-type": "application/json",
                    },
                    body: JSON.stringify(video),
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
            } else {
              alert("Invalid OTP. Please try again.");
            }
          })
          .catch((err) => {
            console.error("Error verifying OTP:", err);
            alert("Failed to verify OTP. Please try again later.");
          });
      })
      .catch((err) => {
        console.error("Error requesting OTP:", err);
        alert("Failed to request OTP. Please try again later.");
      });
  };

  return (
    <div className="tweetBox">
      <form onSubmit={handleTweet}>
        <div className="tweetBox__input">
          <Avatar src={userProfilePic} />
          <input
            type="text"
            placeholder="What's happening?"
            onChange={(e) => setPost(e.target.value)}
            value={post}
            required
          />
        </div>
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
              <p>Loading...</p>
            ) : (
              <p>{videoURL ? t("Video uploaded") : t("Upload Video")}</p>
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
        <Button className="tweetBox__tweetButton" type="submit">
          {t("Tweet")}
        </Button>
      </form>
    </div>
  );
};

export default TweetBox;
