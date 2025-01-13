import React, { createContext, useContext } from "react";
import { useMediaQuery } from "@mui/material";
import ResponsiveButton from "../components/display/ResponsiveButton";

const ResponsiveContext = createContext();

// Thiết bị di động nhỏ (Small Mobile): Dưới 360px → Điện thoại cỡ nhỏ (iPhone SE, Galaxy A01)
// Thiết bị di động vừa (Mobile): 361px – 480px → Điện thoại phổ thông (iPhone 12 Mini, Galaxy S series)
// Thiết bị di động lớn (Large Mobile): 481px – 600px → Điện thoại màn hình lớn (iPhone 12 Pro Max, Galaxy Note)
// Máy tính bảng nhỏ (Small Tablet) / Phablet: 601px – 768px → iPad Mini, Galaxy Tab nhỏ, hoặc các dòng điện thoại màn hình gập
// Máy tính bảng tiêu chuẩn (Tablet): 769px – 1024px → iPad tiêu chuẩn, Galaxy Tab
// Laptop nhỏ (Small Laptop): 1025px – 1280px → Laptop 13 inch

export const useResponsive = () => {
  return useContext(ResponsiveContext);
};

export const ResponsiveProvider = ({ children }) => {
  const isSmallMobile = useMediaQuery("(max-width:377px)");
  const isMobile = useMediaQuery("(max-width:500px)");
  const isLargeMobile = useMediaQuery("(max-width:650px)");
  const isSmallTablet = useMediaQuery("(max-width:700px)");

  return (
    <ResponsiveContext.Provider
      value={{
        isSmallMobile,
        isMobile,
        isLargeMobile,
        isSmallTablet,
        ResponsiveButton,
      }}
    >
      {children}
    </ResponsiveContext.Provider>
  );
};
