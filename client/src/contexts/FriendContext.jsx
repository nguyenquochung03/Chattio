import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useClientInfo } from "./ClientInfoContext";
import { useLoading } from "./LoadingContext";
import { useSnackbar } from "./SnackbarContext";
import { useSocket } from "./SocketContext";

const FriendContext = createContext();

export const useFriend = () => {
  return useContext(FriendContext);
};

export const FriendProvider = ({ children }) => {
  const { showSnackbar, hideSnackbar } = useSnackbar();
  const { showLoading, hideLoading } = useLoading();
  const clientInfo = useClientInfo();
  const socket = useSocket();

  const fetchFriends = async (page) => {
    showLoading();
    try {
      const response = await axios.get(
        `${clientInfo.serverName}/api/friends/friend/list?userId=${clientInfo.user._id}&page=${page}`
      );

      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        showSnackbar(response.data.message, "error");
        return { sucess: false };
      }
    } catch (err) {
      hideLoading();
      showSnackbar(`Có lỗi xảy ra khi lấy danh sách bạn bè:`, err);
      console.error(`Có lỗi xảy ra khi lấy danh sách bạn bè:`, err);
      return { sucess: false };
    } finally {
      hideLoading();
    }
  };

  const fetchFriendRequests = async (page) => {
    showLoading();
    try {
      const response = await axios.get(
        `${clientInfo.serverName}/api/friends/friendRequests/request?userId=${clientInfo.user._id}&page=${page}`
      );

      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        showSnackbar(response.data.message, "error");
        return { sucess: false };
      }
    } catch (err) {
      hideLoading();
      showSnackbar(`Có lỗi xảy ra khi lấy danh sách lời mời kết bạn:`, err);
      console.error(`Có lỗi xảy ra khi lấy danh sách lời mời kết bạn:`, err);
      return { sucess: false };
    } finally {
      hideLoading();
    }
  };

  const fetchSentRequests = async (page) => {
    showLoading();
    try {
      const response = await axios.get(
        `${clientInfo.serverName}/api/friends/friendRequests/sentRequest?userId=${clientInfo.user._id}&page=${page}`
      );

      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        showSnackbar(response.data.message, "error");
        return { sucess: false };
      }
    } catch (err) {
      hideLoading();
      showSnackbar(`Có lỗi xảy ra khi lấy danh sách lời mời kết bạn:`, err);
      console.error(`Có lỗi xảy ra khi lấy danh sách lời mời kết bạn:`, err);
      return { sucess: false };
    } finally {
      hideLoading();
    }
  };

  const fetchFriendRequestCount = async () => {
    showLoading();
    try {
      const response = await axios.get(
        `${clientInfo.serverName}/api/friends/friendRequests/request/count/${clientInfo.user._id}`
      );

      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        showSnackbar(response.data.message, "error");
        return { sucess: false };
      }
    } catch (err) {
      hideLoading();
      showSnackbar(`Đã xảy ra lỗi khi kiểm tra yêu cầu kết bạn:`, err);
      console.error(`Đã xảy ra lỗi khi kiểm tra yêu cầu kết bạn:`, err);
      return { sucess: false };
    } finally {
      hideLoading();
    }
  };

  const fetchSentRequestCount = async () => {
    showLoading();
    try {
      const response = await axios.get(
        `${clientInfo.serverName}/api/friends/friendRequests/sentRequest/count/${clientInfo.user._id}`
      );

      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        showSnackbar(response.data.message, "error");
        return { sucess: false };
      }
    } catch (err) {
      hideLoading();
      showSnackbar(`Đã xảy ra lỗi khi kiểm tra yêu cầu kết bạn đã gửi:`, err);
      console.error(`Đã xảy ra lỗi khi kiểm tra yêu cầu kết bạn đã gửi:`, err);
      return { sucess: false };
    } finally {
      hideLoading();
    }
  };

  const fetchAcceptedRequestCount = async () => {
    showLoading();
    try {
      const response = await axios.get(
        `${clientInfo.serverName}/api/friends/friendRequests/acceptedRequest/count/${clientInfo.user._id}`
      );

      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        showSnackbar(response.data.message, "error");
        return { sucess: false };
      }
    } catch (err) {
      hideLoading();
      showSnackbar(
        `Đã xảy ra lỗi khi kiểm tra yêu cầu kết bạn đã được chấp nhận:`,
        err
      );
      console.error(
        `Đã xảy ra lỗi khi kiểm tra yêu cầu kết bạn đã được chấp nhận:`,
        err
      );
      return { sucess: false };
    } finally {
      hideLoading();
    }
  };

  const fetchAddFriend = async (receiverId) => {
    showLoading();
    try {
      const response = await axios.post(
        `${clientInfo.serverName}/api/friends/friendRequests/add/`,
        {
          senderId: clientInfo.user._id,
          receiverId: receiverId,
        }
      );

      if (response.data.success) {
        socket.emit("add-friend", {
          sender: clientInfo.user,
          receiverId: receiverId,
        });
        return { success: true, data: response.data.data };
      } else {
        showSnackbar(response.data.message, "error");
        return { sucess: false };
      }
    } catch (err) {
      hideLoading();
      showSnackbar(`Đã xảy ra lỗi khi gửi yêu cầu kết bạn:`, err);
      console.error(`Đã xảy ra lỗi khi gửi yêu cầu kết bạn:`, err);
      return { sucess: false };
    } finally {
      hideLoading();
    }
  };

  const fetchCancelFriendRequest = async (receiverId) => {
    showLoading();
    try {
      const response = await axios.delete(
        `${clientInfo.serverName}/api/friends/friendRequests/cancelRequest/`,
        {
          data: {
            senderId: clientInfo.user._id,
            receiverId: receiverId,
          },
        }
      );

      if (response.data.success) {
        socket.emit("cancel-request", {
          sender: clientInfo.user,
          receiverId: receiverId,
        });
        return { success: true, data: response.data.data };
      } else {
        showSnackbar(response.data.message, "error");
        return { sucess: false };
      }
    } catch (err) {
      hideLoading();
      showSnackbar(`Đã xảy ra lỗi khi hủy yêu cầu kết bạn:`, err);
      console.error(`Đã xảy ra lỗi khi hủy yêu cầu kết bạn:`, err);
      return { sucess: false };
    } finally {
      hideLoading();
    }
  };

  const fetchRejectFriendRequest = async (senderId) => {
    showLoading();
    try {
      const response = await axios.delete(
        `${clientInfo.serverName}/api/friends/friendRequests/reject/`,
        {
          data: {
            senderId: senderId,
            receiverId: clientInfo.user._id,
          },
        }
      );

      if (response.data.success) {
        socket.emit("reject-friend-request", {
          senderId: senderId,
          receiver: clientInfo.user,
        });

        showSnackbar(response.data.message, "success");
        return { success: true, data: response.data.data };
      } else {
        showSnackbar(response.data.message, "error");
        return { sucess: false };
      }
    } catch (err) {
      hideLoading();
      showSnackbar(`Đã xảy ra lỗi khi hủy yêu cầu kết bạn:`, err);
      console.error(`Đã xảy ra lỗi khi hủy yêu cầu kết bạn:`, err);
      return { sucess: false };
    } finally {
      hideLoading();
    }
  };

  const fetchAcceptFriendRequest = async (senderId) => {
    showLoading();

    try {
      const response = await axios.post(
        `${clientInfo.serverName}/api/friends/friendRequests/accept/`,
        {
          senderId: senderId,
          receiverId: clientInfo.user._id,
        }
      );

      if (response.data.success) {
        socket.emit("accept-friend-request", {
          senderId: senderId,
          receiver: clientInfo.user,
        });

        showSnackbar(response.data.message, "success");
        return { success: true, data: response.data.data };
      } else {
        showSnackbar(response.data.message, "error");
        return { sucess: false };
      }
    } catch (err) {
      hideLoading();
      showSnackbar(`Đã xảy ra lỗi khi hủy yêu cầu kết bạn:`, err);
      console.error(`Đã xảy ra lỗi khi hủy yêu cầu kết bạn:`, err);
      return { sucess: false };
    } finally {
      hideLoading();
    }
  };

  const fetchConfirmAcceptedRequest = async (receiverId) => {
    showLoading();

    try {
      const response = await axios.post(
        `${clientInfo.serverName}/api/friends/friendRequests/confirmAcceptedRequest/`,
        {
          senderId: clientInfo.user._id,
          receiverId: receiverId,
        }
      );

      if (response.data.success) {
        return true;
      } else {
        showSnackbar(response.data.message, "error");
        return false;
      }
    } catch (err) {
      hideLoading();
      showSnackbar(
        `Đã xảy ra lỗi khi xác nhận lời mời kết bạn được đồng ý:`,
        err
      );
      console.error(
        `Đã xảy ra lỗi khi xác nhận lời mời kết bạn được đồng ý:`,
        err
      );
      return false;
    } finally {
      hideLoading();
    }
  };

  const fetchAcceptedRequests = async (page) => {
    showLoading();

    try {
      const response = await axios.get(
        `${clientInfo.serverName}/api/friends/friendRequests/acceptRequests?userId=${clientInfo.user._id}&page=${page}`
      );

      if (response.data.success) {
        return { success: true, data: response.data.data };
      } else {
        showSnackbar(response.data.message, "error");
        return { success: false };
      }
    } catch (err) {
      hideLoading();
      showSnackbar(
        `Đã xảy ra lỗi khi lấy danh sách lời mời kết bạn được đồng ý:`,
        err
      );
      console.error(
        `Đã xảy ra lỗi khi lấy danh sách lời mời kết bạn được đồng ý:`,
        err
      );
      return { success: false };
    } finally {
      hideLoading();
    }
  };

  return (
    <FriendContext.Provider
      value={{
        fetchFriends,
        fetchFriendRequests,
        fetchSentRequests,
        fetchFriendRequestCount,
        fetchSentRequestCount,
        fetchAcceptedRequestCount,
        fetchAddFriend,
        fetchCancelFriendRequest,
        fetchRejectFriendRequest,
        fetchAcceptFriendRequest,
        fetchConfirmAcceptedRequest,
        fetchAcceptedRequests,
      }}
    >
      {children}
    </FriendContext.Provider>
  );
};