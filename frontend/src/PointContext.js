import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import UseLoggedInUser from "./hooks/UseLoggedInUser";

const PointContext = createContext();

const PointProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [loggedInUser] = UseLoggedInUser();
  const userEmail = loggedInUser[0]?.email;

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/loggedInUser?email=${userEmail}`
        );
        if (response.data.length > 0) {
          setPoints(response.data[0].points || 0);
        }
      } catch (error) {
        console.error("Failed to fetch user points:", error);
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
