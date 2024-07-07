import React from "react";
import UseLoggedInUser from "../../hooks/UseLoggedInUser";
import "./Lists.css";
import Badge from "./Badge/Badge";
import { useTranslation } from "react-i18next";

const Lists = () => {
  const [loggedInUser] = UseLoggedInUser();
  const likes = loggedInUser[0]?.likes?.length;
  const retweets = loggedInUser[0]?.retweets?.length; // Assuming retweets is part of user data
  const { t } = useTranslation();

  const receivedBadges = [];
  const availableBadges = [
    {
      title: t("Super Liker"),
      description: t("Awarded for receiving 2 or more likes."),
    },
    {
      title: t("Retweet Champion"),
      description: t("Awarded for receiving 2 or more retweets."),
    },
    {
      title: t("Classic Liker"),
      description: t("Awarded for receiving 4 or more likes."),
    },
    {
      title: t("Classic Retweeter"),
      description: t("Awarded for receiving 4 or more retweets."),
    },
  ];

  if (likes >= 2) {
    receivedBadges.push({
      title: t("Super Liker"),
      description: t("Keep Going."),
    });
  }
  if (likes >= 4) {
    receivedBadges.push({
      title: t("Classic Liker"),
      description: t("Keep Going."),
    });
  }

  if (retweets >= 2) {
    receivedBadges.push({
      title: t("Retweet Champion"),
      description: t("Keep Going."),
    });
  }
  if (retweets >= 4) {
    receivedBadges.push({
      title: t("Classic Retweeter"),
      description: t("Keep Going."),
    });
  }

  return (
    <div className="page">
      <div className="received-badges">
        <h2>{t("Received Badges")}</h2>
        {receivedBadges.length > 0 ? (
          receivedBadges.map((badge, index) => (
            <Badge
              key={index}
              title={badge.title}
              description={badge.description}
              received={true}
            />
          ))
        ) : (
          <p>{t("No badges received yet.")}</p>
        )}
      </div>
      <div className="available-badges">
        <h2>{t("Available Badges")}</h2>
        {availableBadges.map((badge, index) => (
          <Badge
            key={index}
            title={badge.title}
            description={badge.description}
            received={false}
          />
        ))}
      </div>
    </div>
  );
};

export default Lists;
