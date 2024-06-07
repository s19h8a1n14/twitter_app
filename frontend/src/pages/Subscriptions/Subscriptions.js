import React from "react";
import "./Subscriptions.css";
import UseLoggedInUser from "../../hooks/UseLoggedInUser";
import { useTranslation } from "react-i18next";

function App() {
  const [loggedInUser] = UseLoggedInUser();
  const subscribed = loggedInUser[0]?.subscription;
  const plan = loggedInUser[0]?.isSubscribed;
  const { t } = useTranslation();

  return (
    <div className="App">
      <header className="App-header">
        <h1>{t("Subscribe to Twitter Premium")}</h1>
        <p>
          {t("Enjoy exclusive features and enhance your Twitter experience.")}
        </p>
        <div className="subscription-plans">
          <div className="plan">
            <h2>{t("Monthly Plan")}</h2>
            <p className="price">₹189</p>
            <ul className="features">
              <li>{t("Blue tick")}</li>
              <li>{t("Unlimited posts per day")}</li>
              <li>{t("Unlimited space for videos")}</li>
            </ul>
            {!subscribed ? (
              <a
                href="https://buy.stripe.com/test_bIYcPY50A6web847su"
                className="subscribe-button"
              >
                {t("Subscribe Now")}
              </a>
            ) : plan === 1 ? (
              <span className="subscribe-button">{t("Your Plan")}</span>
            ) : (
              <span className="subscribe-button">{t("Subscribed")}</span>
            )}
          </div>
          <div className="plan">
            <h2>{t("Yearly Plan")}</h2>
            <p className="price">₹689</p>
            <ul className="features">
              <li>{t("Blue tick")}</li>
              <li>{t("Unlimited posts per day")}</li>
              <li>{t("Unlimited space for videos")}</li>
            </ul>
            {!subscribed ? (
              <a
                href="https://buy.stripe.com/test_cN2dU20Kkg6Oekg5kl"
                className="subscribe-button"
              >
                {t("Subscribe Now")}
              </a>
            ) : plan === 2 ? (
              <span className="subscribe-button">{t("Your Plan")}</span>
            ) : (
              <span className="subscribe-button">{t("Subscribed")}</span>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
