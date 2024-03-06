import React, { useState, createContext } from "react";

export const SharedUserContext = createContext();

export const SharedUserDataProvider = ({ children }) => {
  const [sharedUserData, setSharedUserData] = useState(null);

  return (
    <SharedUserContext.Provider
      value={{ sharedUserData, setSharedUserData }}
    >
      {children}
    </SharedUserContext.Provider>
  );
};
