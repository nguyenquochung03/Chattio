import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
  CircularProgress,
  Tooltip,
  Button,
} from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import GroupIcon from "@mui/icons-material/Group";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useClientInfo } from "../contexts/ClientInfoContext";

const Sidebar = () => {
  const clientInfo = useClientInfo();

  // State to track the focused item
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  const getAvatar = (user) => {
    if (user.avatar?.length > 0) {
      return <Avatar src={user.avatar} />;
    } else {
      return (
        <Avatar
          sx={{
            bgcolor: "primary.light",
            color: "white",
            fontWeight: 600,
          }}
          src={"https://cdn-icons-png.flaticon.com/128/3177/3177440.png"}
        />
      );
    }
  };

  return (
    <Box
      sx={{
        width: "fit-content",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRight: "1.6px solid #f2f0f0",
        padding: 2,
      }}
    >
      {/* Biểu tượng trang web */}
      <List>
        <ListItemButton
          sx={{
            cursor: "default",
            "&:hover": {
              backgroundColor: "transparent",
            },
            "& .MuiTouchRipple-root": {
              color: "transparent",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* Chỉ hiển thị ListItemIcon khi isSidebarHidden là false */}
            {!isSidebarHidden && (
              <ListItemIcon sx={{ minWidth: "40px" }}>
                <img
                  src="https://cdn-icons-png.freepik.com/256/18296/18296255.png?ga=GA1.1.882692981.1736500425&semt=ais_hybrid"
                  alt="Avatar Image"
                  style={{
                    width: "35px",
                    height: "35px",
                    objectFit: "contain",
                  }}
                />
              </ListItemIcon>
            )}

            {/* Luôn hiển thị IconButton để thay đổi trạng thái isSidebarHidden */}
            <IconButton
              onClick={() => setIsSidebarHidden(!isSidebarHidden)}
              sx={{ position: "relative" }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </ListItemButton>
      </List>

      {/* Menu */}
      <List>
        {[
          { icon: <MessageIcon />, text: "Tin nhắn" },
          { icon: <GroupIcon />, text: "Mọi người" },
          { icon: <PersonAddIcon />, text: "Yêu cầu kết bạn" },
          { icon: <SettingsIcon />, text: "Cài đặt" },
        ].map((item, index) => (
          <ListItemButton
            key={index}
            onClick={() => setFocusedIndex(index)}
            sx={{
              borderRadius: "8px",
              mb: 1,
              paddingY: 1.2,
              transition: "all 0.3s",
              backgroundColor:
                focusedIndex === index ? "#d4e6fc" : "transparent",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
              "& .MuiTouchRipple-root": {
                color: "#1976d2",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: focusedIndex === index ? "info.main" : "#424242",
                minWidth: "40px",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!isSidebarHidden && (
              <ListItemText
                primary={item.text}
                sx={{
                  color: focusedIndex === index ? "info.main" : "#424242",
                  fontWeight: focusedIndex === index ? "bold" : 500,
                }}
              />
            )}
          </ListItemButton>
        ))}
      </List>

      {/* Dòng dưới cùng: Avatar, Tên người dùng, Đăng xuất */}
      <Box
        sx={{
          marginTop: "auto",
          paddingTop: 1,
          marginBottom: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Tooltip title="Xem hồ sơ" arrow placement="top">
          <Button
            onClick={() => console.log("Avatar clicked!")}
            sx={{
              display: "flex",
              alignItems: "center",
              textTransform: "none",
              padding: "8px 12px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            {clientInfo.user._id ? (
              getAvatar(clientInfo.user)
            ) : (
              <CircularProgress size={32} />
            )}
            <Typography sx={{ marginLeft: 1, color: "#000" }}>
              {clientInfo.user.username}
            </Typography>
          </Button>
        </Tooltip>
        <Tooltip title="Đăng xuất" arrow placement="top">
          <IconButton>
            <LogoutIcon sx={{ color: "primary.main" }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Sidebar;
