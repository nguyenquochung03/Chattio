// src/contexts/HomeContext.js
import React, { createContext, useContext, useState } from "react";

const HomeContext = createContext();

export const useHome = () => {
  return useContext(HomeContext);
};

export const HomeProvider = ({ children }) => {
  const [isSidebarHidden, setIsSidebarHidden] = useState(true);

  return (
    <HomeContext.Provider
      value={{
        isSidebarHidden,
        setIsSidebarHidden,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
