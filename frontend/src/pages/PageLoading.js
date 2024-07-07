import React from "react";
import TwitterImage from "../assets/images/twitter.png";

const PageLoading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "white", // Optional: change the background color as needed
      }}
    >
      <img src={TwitterImage} alt="Twitter" />
    </div>
  );
};

export default PageLoading;
