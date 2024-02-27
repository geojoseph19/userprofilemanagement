import React, { useState, createContext } from "react";

export const SharedUserContext = createContext();

export const SharedUserDataProvider = ({ children }) => {
  const [sharedUserData, setSharedUserData] = useState(null);
  const [currentSemester, setCurrentSemester] = useState(0);
  const [totalSemesters, setTotalSemesters] = useState(0);

  return (
    <SharedUserContext.Provider
      value={{ 
        sharedUserData, 
        setSharedUserData,
        currentSemester,
        setCurrentSemester,
        totalSemesters,
        setTotalSemesters
      }}
    >
      {children}
    </SharedUserContext.Provider>
  );
};
