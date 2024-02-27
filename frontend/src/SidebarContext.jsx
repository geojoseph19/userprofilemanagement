import React, { createContext, useState, useContext } from 'react';

// Create the context
export const SidebarContext = createContext();

// Create a custom hook to use the sidebar context
export const useSidebar = () => useContext(SidebarContext);

// Create the provider component
export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
