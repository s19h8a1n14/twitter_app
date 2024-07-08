import React from "react";
import UseLoggedInUser from "../../hooks/UseLoggedInUser";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DoneIcon from '@mui/icons-material/Done';
import "./Premium.css";
import { useTranslation } from "react-i18next";


const Premium = () => {
  const navigate = useNavigate();
  const [loggedInUser] = UseLoggedInUser();
  const subscribed = loggedInUser[0]?.isSubscribed;
  const plan = loggedInUser[0]?.subscriptionType;
  const { t } = useTranslation();

  return (
    <>
      <div className="container">
        <nav className="navbar">
          <ArrowBackIcon
            className="arrow-icon"
            onClick={() => {
              navigate("/");
            }}
          />
        </nav>
        <h1>{t("Premium Plans")}</h1>
        <div class="text-color">
          <h2>{t("Enjoy exclusive features and enhance your Twitter experience.")}</h2>
        </div>
        <div className="card-grid">
          <div className="plan" id="bg1">
            <h2>{t("Basic")}</h2>
            <span className="price">₹99.00</span><span class="small">{t("/month")}</span>

            {!subscribed ? (
              <a
                href="https://buy.stripe.com/test_7sI6pW3V01kx4Kc4gg"
                className="subscribe-button"
              >
                {t("subscribe")}
              </a>
            ) : plan === "Basic" ? (
              <span className="subscribe-button">{t("Your Plan")}</span>
            ) : (
              <span className="subscribe-button">{t("Subscribed")}</span>
            )}




            <ul className="features">
              <li><DoneIcon className="done-icon" />{t("Black tick")}</li>
              <li><DoneIcon className="done-icon" />{t("20+ posts per day")}</li>
              <li><DoneIcon className="done-icon" />{t("Unlimited Video space")}</li>
            </ul>
          </div>
          <div className="plan" id="bg2">
            <h2>{t("Premium")}</h2>
            <span className="price">₹299.00</span><span class="small">{t("/month")}</span>

            {!subscribed ? (
              <a
                href="https://buy.stripe.com/test_aEU4hO4Z4fbn1y0cMN"
                className="subscribe-button"
              >
                {t("subscribe")}
              </a>
            ) : plan === "Premium" ? (
              <span className="subscribe-button">{t("Your Plan")}</span>
            ) : (
              <span className="subscribe-button">{t("Subscribed")}</span>
            )}
            <ul className="features">
              <li><DoneIcon className="done-icon" />{t("Blue tick")}</li>
              <li><DoneIcon className="done-icon" />{t("50+ posts per day")}</li>
              <li><DoneIcon className="done-icon" />{t("Unlimited Video space")}</li>
            </ul>
          </div>
          <div className="plan" id="bg3">
            <h2>{t("Premium+")}</h2>
            <span className="price">₹499.00</span><span class="small">{t("/month")}</span>

            {!subscribed ? (
              <a
                href="https://buy.stripe.com/test_3csdSo0IOe7j6SkfZ0"
                className="subscribe-button"
              >
                {t("subscribe")}
              </a>
            ) : plan === "PremiumPlus" ? (
              <span className="subscribe-button">{t("Your Plan")}</span>
            ) : (
              <span className="subscribe-button">{t("Subscribed")}</span>
            )}
            <ul className="features">
              <li><DoneIcon className="done-icon" />{t("Golden tick")}</li>
              <li><DoneIcon className="done-icon" />{t("Unlimited posts per day")}</li>
              <li><DoneIcon className="done-icon" />{t("Unlimited Video space")}</li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
};

export default Premium;