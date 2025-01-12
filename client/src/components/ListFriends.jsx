import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useResponsive } from "../contexts/ResponsiveContext";
import { useHome } from "../contexts/HomeContext";

const ListFriends = () => {
  const responsive = useResponsive();
  const { isSidebarHidden } = useHome();
  const [isLargeMobile, setIsLargeMobile] = useState(responsive.isLargeMobile);

  useEffect(() => {
    setIsLargeMobile(responsive.isLargeMobile);
  }, [responsive.isLargeMobile]);

  return (
    <Box
      sx={{
        borderRadius: 4,
        maxWidth: !isSidebarHidden && isLargeMobile ? "100wh" : "350px",
        display: "flex",
        flexDirection: "column",
        padding: 2,
      }}
    >
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure vel,
      deleniti nemo dignissimos soluta quam vitae, impedit facere veritatis
      repellat laudantium deserunt animi explicabo, maiores in saepe assumenda
      nam ex.
    </Box>
  );
};

export default ListFriends;
