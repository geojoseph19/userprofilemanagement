
import React, { useState, createContext } from "react";

export const SharedUserContext = createContext();

export const SharedUserDataProvider = ({ children }) => {
  const [sharedUserData, setSharedUserData] = useState({}); // Provide default empty object
  const [currentSemester, setCurrentSemester] = useState(0);
  const [totalSemesters, setTotalSemesters] = useState(0);
  const [projectDetails,setProjectDetails]=useState('');

  return (
    <SharedUserContext.Provider
      value={{ 
        sharedUserData, 
        setSharedUserData,
        currentSemester,
        setCurrentSemester,
        totalSemesters,
        setTotalSemesters,
        projectDetails,
        setProjectDetails
      }}
    >
      {children}
    </SharedUserContext.Provider>
  );
};