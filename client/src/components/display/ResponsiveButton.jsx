import React from "react";
import { Button } from "@mui/material";

const ResponsiveButton = ({ variant, color, children, sx, ...props }) => {
  return (
    <Button
      variant={variant}
      color={color}
      sx={{
        textTransform: "none",
        padding: "6px 12px",
        fontSize: "14px",
        borderRadius: "10px",
        "@media (max-width: 600px)": {
          fontSize: "12px",
          padding: "6px 7px",
          borderRadius: "8px",
        },
        "@media (min-width: 601px) and (max-width: 1024px)": {
          fontSize: "12px",
          padding: "6px 8px",
          borderRadius: "8px",
        },
        "@media (min-width: 1025px)": {
          fontSize: "13px",
          padding: "6px 12px",
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ResponsiveButton;
