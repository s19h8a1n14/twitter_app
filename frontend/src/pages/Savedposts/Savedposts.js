import React from 'react'
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Savedposts = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
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
            <h1>{t("Saved Posts")}</h1>
            <div>
            <hr style={{ border: '0.5px solid #ccc', margin: '2px 0' }} />
                <h2>{t("You haven't saved any posts yet")}</h2>
            </div>
        </div>
    )
}

export default Savedposts