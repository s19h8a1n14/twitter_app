import React, { createContext, useState } from 'react';

const RewardPointsContext = createContext({
  points: 0,
  setPoints: () => {},
});

 const RewardPointsProvider = ({ children }) => {
  const [points, setPoints] = useState(0); // Initial points value

  const updatePoints = (newPoints) => {
    setPoints(newPoints);
  };

  return (
    <RewardPointsContext.Provider value={{ points, updatePoints }}>
      {children}
    </RewardPointsContext.Provider>
  );
};

export { RewardPointsContext, RewardPointsProvider };
