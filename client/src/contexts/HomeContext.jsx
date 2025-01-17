// src/contexts/HomeContext.js
import React, { createContext, useContext, useState } from "react";

const HomeContext = createContext();

export const useHome = () => {
  return useContext(HomeContext);
};

export const HomeProvider = ({ children }) => {
  const [isSidebarHidden, setIsSidebarHidden] = useState(true);

  //// Trang danh sách lời mời kết bạn gửi đến
  // Dữ liệu danh sách lời mời kết bạn gửi đến
  const [friendRequests, setFriendRequests] = useState([]);
  // Lưu trang hiện tại đã load đến
  const [friendRequestsPage, setFriendRequestsPage] = useState(2);
  // Có tải dữ liệu chưa
  const [isLoadedFriendRequests, setIsLoadedFriendRequests] = useState(false);

  //// Trang danh sách bạn bè được gợi ý
  // Danh sách bạn bè được khuyến nghị
  const [suggestions, setSuggestions] = useState([]);
  // Lưu trang hiện tại đã load đến
  const [suggestionsPage, setSuggestionsPage] = useState(2);
  // Có tải dữ liệu chưa
  const [isLoadedSuggestedUser, setIsLoadedSuggestedUser] = useState(false);

  //// Trang danh sách bạn bè đã gửi
  // Danh sách thêm bạn bè đã gửi
  const [sentRequests, setSentRequests] = useState([]);
  // Lưu trang hiện tại đã load đến
  const [sentRequestsPage, setSentRequestsPage] = useState(2);
  // Có tải dữ liệu chưa
  const [isLoadedSentRequests, setIsLoadedSentRequests] = useState(false);

  //// Trang danh sách bạn bè hiện tại
  // Danh sách bạn bè hiện tại
  const [friends, setFriends] = useState([]);
  // Lưu trang hiện tại đã load đến
  const [friendsPage, setFriendsPage] = useState(2);
  // Có tải dữ liệu chưa
  const [isLoadedFriends, setIsLoadedFriends] = useState(false);

  //// Danh sách lời mời kết bạn đã được chấp nhận và đang chờ xác nhận
  // Danh sách lời mời kết bạn đã được chấp nhận và đang chờ xác nhận hiện tại
  const [acceptedConfirms, setAcceptedConfirms] = useState([]);
  // Lưu trang hiện tại đã load đến
  const [acceptedConfirmsPage, setAcceptedConfirmsPage] = useState(2);

  return (
    <HomeContext.Provider
      value={{
        isSidebarHidden,
        setIsSidebarHidden,
        //// Trang danh sách lời mời kết bạn gửi đến
        friendRequests,
        setFriendRequests,
        friendRequestsPage,
        setFriendRequestsPage,
        isLoadedFriendRequests,
        setIsLoadedFriendRequests,
        //// Trang danh sách bạn bè được gợi ý/đã gửi lời mời/bạn bè hiện tại
        suggestions,
        setSuggestions,
        suggestionsPage,
        setSuggestionsPage,
        isLoadedSuggestedUser,
        setIsLoadedSuggestedUser,
        sentRequests,
        setSentRequests,
        sentRequestsPage,
        setSentRequestsPage,
        isLoadedSentRequests,
        setIsLoadedSentRequests,
        friends,
        setFriends,
        friendsPage,
        setFriendsPage,
        isLoadedFriends,
        setIsLoadedFriends,
        acceptedConfirms,
        setAcceptedConfirms,
        acceptedConfirmsPage,
        setAcceptedConfirmsPage,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
