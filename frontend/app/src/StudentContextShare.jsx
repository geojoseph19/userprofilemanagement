import React, { useState, createContext } from "react";

export const SharedStudentContext = createContext();

export const SharedStudentDataProvider = ({ children }) => {
  const [sharedStudentData, setSharedStudentData] = useState(null);

  return (
    <SharedStudentContext.Provider
      value={{ sharedStudentData, setSharedStudentData }}
    >
      {children}
    </SharedStudentContext.Provider>
  );
};
