import React from "react";
import UseLoggedInUser from "../../hooks/UseLoggedInUser";
import "./Lists.css";
import Badge from "./Badge/Badge";

const Lists = () => {
  const [loggedInUser] = UseLoggedInUser();
  const likes = loggedInUser[0]?.likes?.length;
  const retweets = loggedInUser[0]?.retweets?.length; // Assuming retweets is part of user data

  const receivedBadges = [];
  const availableBadges = [
    {
      title: "Super Liker",
      description: "Awarded for receiving 2 or more likes.",
    },
    {
      title: "Retweet Champion",
      description: "Awarded for receiving 2 or more retweets.",
    },
  ];

  if (likes >= 2) {
    receivedBadges.push({
      title: "Super Liker",
      description: "Awarded for receiving 2 or more likes.",
    });
  }

  if (retweets >= 2) {
    receivedBadges.push({
      title: "Retweet Champion",
      description: "Awarded for receiving 2 or more retweets.",
    });
  }

  return (
    <div className="page">
      <div className="received-badges">
        <h2>Received Badges</h2>
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
          <p>No badges received yet.</p>
        )}
      </div>
      <div className="available-badges">
        <h2>Available Badges</h2>
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
