import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { useResponsive } from "../contexts/ResponsiveContext";
import { useHome } from "../contexts/HomeContext";

const HomePage = () => {
  const responsive = useResponsive();
  const { isSidebarHidden } = useHome();
  const [isLargeMobile, setIsLargeMobile] = useState(responsive.isLargeMobile);

  useEffect(() => {
    setIsLargeMobile(responsive.isLargeMobile);
  }, [responsive.isLargeMobile]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        backgroundColor: "#f0f4f8",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <Box
        sx={{
          margin: "10px",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
          backgroundColor: "white",
          borderRadius: 3,
          position: "absolute",
          top: isLargeMobile ? 0 : 2,
          bottom: isLargeMobile ? 0 : 2,
          left: isLargeMobile ? 0 : 2,
          right: isLargeMobile ? 0 : 2,
          display: "flex",
          flexDirection: "row",
        }}
      >
        {isLargeMobile && !isSidebarHidden && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 998,
              borderRadius: 3,
            }}
          />
        )}

        {/* Sidebar cố định */}
        <Sidebar />

        {/* Nội dung động */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default HomePage;
