import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import UseLoggedInUser from "./hooks/UseLoggedInUser";
import API_CONFIG from "./config/api";

const PointContext = createContext();

const PointProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [loggedInUser] = UseLoggedInUser();
  const userEmail = loggedInUser[0]?.email;

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}/loggedInUser?email=${userEmail}`
        );
        if (response.data.length > 0) {
          setPoints(response.data[0].points || 0);
        }
      } catch (error) {
        // Silently fail - user points will default to 0
      }
    };

    fetchUserPoints();
  }, [userEmail]);

  return (
    <PointContext.Provider value={{ points, setPoints }}>
      {children}
    </PointContext.Provider>
  );
};

export { PointContext, PointProvider };
