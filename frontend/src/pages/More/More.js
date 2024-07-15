import React from "react";
import "../Page.css";
import UseLoggedInUser from "../../hooks/UseLoggedInUser";

const More = () => {
  const [loggedInUser] = UseLoggedInUser();
  const loginHistory = loggedInUser[0]?.loginHistory || [];

  return (
    <div className="page">
      <h2 className="pageTitle">Welcome to More</h2>
      <div className="loginHistory">
        <h3>Login History</h3>
        {loginHistory.length === 0 ? (
          <p>No login history available.</p>
        ) : (
          <ul>
            {loginHistory.map((entry, index) => (
              <li key={index} className="loginEntry">
                <p>
                  <strong>Date:</strong> {new Date(entry.date).toLocaleString()}
                </p>
                <p>
                  <strong>Browser:</strong> {entry.browser}
                </p>
                <p>
                  <strong>OS:</strong> {entry.os}
                </p>
                <p>
                  <strong>Device:</strong> {entry.device}
                </p>
                <p>
                  <strong>IP Address:</strong> {entry.ipAddress}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default More;
