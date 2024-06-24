import React from "react";
import "./Badge.css"; // Create a CSS file for badge styles

const Badge = ({ title, description, received }) => {
  return (
    <div className={`badge-container ${received ? "received" : ""}`}>
      <div className="badge-title">{title}</div>
      <div className="badge-description">{description}</div>
    </div>
  );
};

export default Badge;
