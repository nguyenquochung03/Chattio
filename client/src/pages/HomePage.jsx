import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { useResponsive } from "../contexts/ResponsiveContext";
import { useHome } from "../contexts/HomeContext";
import { useSocket } from "../contexts/SocketContext";
import { useClientInfo } from "../contexts/ClientInfoContext";
import { useFriend } from "../contexts/FriendContext";

const HomePage = () => {
  const clientInfo = useClientInfo();
  const responsive = useResponsive();
  const {
    isSidebarHidden,
    friendRequests,
    setFriendRequests,
    sentRequests,
    setSentRequests,
    acceptedConfirms,
    setAcceptedConfirms,
    friends,
    setFriends,
  } = useHome();
  const friendContext = useFriend();
  const socket = useSocket();
  const [isLargeMobile, setIsLargeMobile] = useState(responsive.isLargeMobile);

  useEffect(() => {
    if (clientInfo.user._id) {
      socket.emit("register", { userId: clientInfo.user._id });
    }
  }, [clientInfo.user._id]);

  useEffect(() => {
    if (socket) {
      socket.on("add-friend", async (data) => {
        if (clientInfo.user._id) {
          await fetchFriendRequestCount();

          const updatedFriendRequests = [...friendRequests, data.sender];
          setFriendRequests(updatedFriendRequests);
        }
      });

      socket.on("cancel-request", async (data) => {
        if (clientInfo.user._id) {
          await fetchFriendRequestCount();

          const updatedFriendRequests = friendRequests.filter(
            (request) => request._id !== data.sender._id
          );
          setFriendRequests(updatedFriendRequests);
        }
      });

      socket.on("reject-friend-request", async (data) => {
        if (clientInfo.user._id) {
          await fetchSentRequestCount();

          const updatedSentRequests = sentRequests.filter(
            (request) => request._id !== data.receiver._id
          );

          setSentRequests(updatedSentRequests);
        }
      });

      socket.on("accept-friend-request", async (data) => {
        if (clientInfo.user._id) {
          await fetchSentRequestCount();
          await fetchAcceptedRequestCount();

          setAcceptedConfirms([...acceptedConfirms, data.receiver]);

          const updatedSentRequests = sentRequests.filter(
            (request) => request._id !== data.receiver._id
          );

          setSentRequests(updatedSentRequests);

          // Cập nhật danh sách bạn bè
          setFriends([...friends, data.receiver]);
        }
      });
    }
  }, [socket, clientInfo.user._id, sentRequests]);

  useEffect(() => {
    if (clientInfo.user._id) {
      fetchFriendRequestCount();
      fetchSentRequestCount();
      fetchAcceptedRequestCount();
    }
  }, [clientInfo.user._id]);

  useEffect(() => {
    setIsLargeMobile(responsive.isLargeMobile);
  }, [responsive.isLargeMobile]);

  const fetchFriendRequestCount = async () => {
    const result = await friendContext.fetchFriendRequestCount();

    if (result.success) {
      clientInfo.setFriendRequestCount(result.data);
    }
  };

  const fetchSentRequestCount = async () => {
    const result = await friendContext.fetchSentRequestCount();

    if (result.success) {
      clientInfo.setSentRequestCount(result.data);
    }
  };

  const fetchAcceptedRequestCount = async () => {
    const result = await friendContext.fetchAcceptedRequestCount();

    if (result.success) {
      clientInfo.setAcceptedRequestCount(result.data);
    }
  };

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
