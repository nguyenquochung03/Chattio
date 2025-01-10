import React, { useState, useEffect } from "react";
import { Snackbar, Alert, Slide, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

const CustomSnackbar = ({
  open,
  message,
  severity = "info",
  onClose,
  autoHideDuration = 3000,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 472);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 472);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const anchorOrigin = isMobile
    ? { vertical: "bottom", horizontal: "center" }
    : { vertical: "bottom", horizontal: "left" };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      TransitionComponent={TransitionUp}
      anchorOrigin={anchorOrigin}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={onClose}
        >
          <Close fontSize="small" />
        </IconButton>
      }
    >
      <Alert
        severity={severity}
        sx={{
          width: "100%",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          fontSize: "16px",
          borderRadius: "8px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
