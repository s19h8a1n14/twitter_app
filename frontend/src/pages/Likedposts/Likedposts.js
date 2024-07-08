import React from 'react'
import "./Likedposts.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Likedposts = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="container">
      <nav className="navbar">
        <ArrowBackIcon
          className="arrow-icon"
          onClick={() => {
            navigate("/");
          }}
        />
      </nav>
      <h1>{t("Liked Posts")}</h1>
      <div>
        <hr style={{ border: '0.5px solid #ccc', margin: '2px 0' }} />
        <h2>{t("You haven't liked any posts yet")}</h2>
      </div>
    </div>
  )
}

export default Likedposts