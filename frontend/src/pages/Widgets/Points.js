import React, { useContext } from "react";
import { PointContext } from "../../PointContext";
import UseLoggedInUser from "../../hooks/UseLoggedInUser";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";

const Points = ({ onClose }) => {
  const { points, setPoints } = useContext(PointContext);
  const [loggedInUser] = UseLoggedInUser();
  const email = loggedInUser[0]?.email;
  const { t } = useTranslation();
  const subscribed = loggedInUser[0]?.subscription;
  const plan = loggedInUser[0]?.isSubscribed;

  const monthly = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/monthly?email=${email}`
      );

      if (response.status === 200) {
        console.log("Subscription updated successfully");
        // Optionally, you can handle any further logic here after successful update
      } else {
        console.error("Failed to update subscription");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };
  const yearly = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/yearly?email=${email}`
      );

      if (response.status === 200) {
        console.log("Subscription updated successfully");
        // Optionally, you can handle any further logic here after successful update
      } else {
        console.error("Failed to update subscription");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  };
  return (
    <div>
      {/* {points}
      <button onClick={(e) => monthly(e)}>monthly</button>
      <button onClick={onClose}>close</button> */}
      <div className="App">
        <header className="App-header">
          <h1>Subscribe to Twitter Premium Through Points</h1>

          <p>
            {t("Enjoy exclusive features and enhance your Twitter experience.")}
          </p>
          <div className="subscription-plans">
            <div className="plan">
              <h2>{t("Monthly Plan")}</h2>
              <p className="price">4 points</p>
              <ul className="features">
                <li>{t("Blue tick")}</li>
                <li>{t("Unlimited posts per day")}</li>
                <li>{t("Unlimited space for videos")}</li>
              </ul>
              {!subscribed ? (
                points >= 4 ? (
                  <Button onClick={(e) => monthly(e)}>
                    {t("Subscribe Now")}
                  </Button>
                ) : (
                  <Button disabled>You do not have enough coins</Button>
                )
              ) : plan === 1 ? (
                <span className="subscribe-button">{t("Your Plan")}</span>
              ) : (
                <span className="subscribe-button">{t("Subscribed")}</span>
              )}
            </div>
            <div className="plan">
              <h2>{t("Yearly Plan")}</h2>
              <p className="price">8 Points</p>
              <ul className="features">
                <li>{t("Blue tick")}</li>
                <li>{t("Unlimited posts per day")}</li>
                <li>{t("Unlimited space for videos")}</li>
              </ul>
              {!subscribed ? (
                points >= 8 ? (
                  <Button onClick={(e) => yearly(e)}>
                    {t("Subscribe Now")}
                  </Button>
                ) : (
                  <Button disabled>You do not have enough coins</Button>
                )
              ) : plan === 2 ? (
                <span className="subscribe-button">{t("Your Plan")}</span>
              ) : (
                <span className="subscribe-button">{t("Subscribed")}</span>
              )}
            </div>
          </div>
          <Button className="close-button" onClick={onClose}>
            Close
          </Button>
        </header>
      </div>
    </div>
  );
};

export default Points;
