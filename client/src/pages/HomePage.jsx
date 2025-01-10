import React from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";

const HomePage = () => {
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
          borderRadius: 5,
          position: "absolute",
          top: 2,
          bottom: 2,
          left: 2,
          right: 2,
        }}
      >
        <Sidebar />
      </Box>
    </Box>
  );
};

export default HomePage;
