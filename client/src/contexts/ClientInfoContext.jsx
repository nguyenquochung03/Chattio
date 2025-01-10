import React, { createContext, useContext, useEffect, useState } from "react";

const ClientInfoContext = createContext();

export const useClientInfo = () => {
  return useContext(ClientInfoContext);
};

export const ClientInfoProvider = ({ children }) => {
  const [serverName] = useState("http://localhost:3000");
  const secret =
    "ansdijqwnd12uej128dj12d812jd128dj12dj2j2jd812jd812jd218dj218dj128dj128dj128dj218dj128dj198dhwuidhkhdbjashdasghdashdv";
  const [emailLogin, setEmailLogin] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isVerified, setIsVerified] = useState(false);
  const [user, setUser] = useState({});

  const saveToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const removeToken = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <ClientInfoContext.Provider
      value={{
        serverName,
        secret,
        emailLogin,
        setEmailLogin,
        token,
        saveToken,
        tempToken,
        setTempToken,
        removeToken,
        user,
        setUser,
        isVerified,
        setIsVerified,
      }}
    >
      {children}
    </ClientInfoContext.Provider>
  );
};
