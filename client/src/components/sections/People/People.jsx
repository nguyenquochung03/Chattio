import React, { useEffect, useRef, useState } from "react";
import {
  Tabs,
  Tab,
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  InputAdornment,
  Badge,
  IconButton,
  Grid,
  CardContent,
  Card,
} from "@mui/material";
import { Search, InfoOutlined, ForwardToInbox } from "@mui/icons-material";
import { useResponsive } from "../../../contexts/ResponsiveContext";
import { useClientInfo } from "../../../contexts/ClientInfoContext";
import { useUser } from "../../../contexts/UserContext";
import { useLoading } from "../../../contexts/LoadingContext";

const People = () => {
  // Thông tin lưu trạng thái của các tab
  const [value, setValue] = useState(0);
  // Kiểm tra có phải chọn tab vào lần đầu
  const [clickedTabs, setClickedTabs] = useState({
    "Đã Gửi": false,
    "Bạn Bè": false,
  });
  // Thông tin tìm kiếm
  const [searchPeople, setSearchPeople] = useState("");
  const [searchFriend, setSearchFriend] = useState("");
  // Kiểm tra đã thực hiện tìm kiếm chưa
  const [isSearchPeople, setIsSearchPeople] = useState(false);
  const [isSearchFriend, setIsSearchFriend] = useState(false);
  // Danh sách tìm kiếm
  const [searchSuggestedUserData, setSearchSuggestedUserData] = useState([]);
  const [searchFriendsData, setSearchFriendsData] = useState([]);
  // Danh sách bạn bè được khuyến nghị
  const [suggestions, setSuggestions] = useState([]);
  // Danh sách thêm bạn bè đã được gửi
  const [sentRequests, setSentRequests] = useState([]);
  // Danh sách bạn bè hiện tại
  const [friends, setFriends] = useState([]);
  // Xử lý khi người dùng cuộn xuống
  const [scrollState, setScrollState] = useState({
    0: false, // State for "Gợi Ý" tab
    1: false, // State for "Đã Gửi" tab
    2: false, // State for "Bạn Bè" tab
  });
  const boxSuggestionsRef = useRef(null);
  const boxSentRequestsRef = useRef(null);
  const boxFriendsRef = useRef(null);
  // Lưu lại trang đã cuộn đến
  const [suggestionsPage, setSuggestionsPage] = useState(2);
  const [sentRequestsPage, setSentRequestsPage] = useState(2);
  const [friendsPage, setFriendsPage] = useState(2);
  // Lưu lại để lấy thêm người dùng
  const [hasMoreSuggestions, setHasMoreSuggestions] = useState(true);
  const [hasMoreSentRequests, setHasMoreSentRequests] = useState(true);
  const [hasMoreFriends, setHasMoreFriends] = useState(true);
  // Sử dụng hook/context
  const { ResponsiveButton, isMobile } = useResponsive();
  const clientInfo = useClientInfo();
  const userContext = useUser();
  const { isLoading } = useLoading();
  // Kiểm tra có phải màn hình điện thoại nhỏ
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(isMobile);
  }, [isMobile]);

  useEffect(() => {
    const handleFetchGetSuggestedUsers = async () => {
      const result = await userContext.fetchGetSuggestedUsers(1, []);

      if (result.success) {
        setSuggestions(result.data);
      }
    };

    handleFetchGetSuggestedUsers();
  }, []);

  useEffect(() => {
    const boxSuggestionsElement = boxSuggestionsRef.current;
    const boxSentRequestsElement = boxSentRequestsRef.current;
    const boxFriendsElement = boxFriendsRef.current;

    if (boxSuggestionsElement && value === 0) {
      boxSuggestionsElement.addEventListener("scroll", handleSuggestionsScroll);

      return () => {
        boxSuggestionsElement.removeEventListener(
          "scroll",
          handleSuggestionsScroll
        );
      };
    } else if (boxSentRequestsElement && value === 1) {
      boxSentRequestsElement.addEventListener(
        "scroll",
        handleSentRequestsScroll
      );

      return () => {
        boxSentRequestsElement.removeEventListener(
          "scroll",
          handleSentRequestsScroll
        );
      };
    } else if (boxFriendsElement && value === 2) {
      boxFriendsElement.addEventListener("scroll", handleFriendsScroll);

      return () => {
        boxFriendsElement.removeEventListener("scroll", handleFriendsScroll);
      };
    }
  }, [
    value,
    hasMoreSuggestions,
    hasMoreSentRequests,
    hasMoreFriends,
    isLoading,
  ]);

  useEffect(() => {
    if (searchPeople.length === 0) {
      setSearchSuggestedUserData([]);
      setIsSearchPeople(false);
    }
  }, [searchPeople]);

  useEffect(() => {
    if (searchFriend.length === 0) {
      setSearchFriendsData([]);
      setIsSearchFriend(false);
    }
  }, [searchFriend]);

  const loadMoreSuggestedUsers = async () => {
    const result = await userContext.fetchGetSuggestedUsers(suggestionsPage);

    if (result.success) {
      if (result.data.length < 14) {
        setHasMoreSuggestions(false);
      }
      setSuggestions((prev) => [...prev, ...result.data]);
      setSuggestionsPage((prev) => prev + 1);
    }
  };

  const handleSuggestionsScroll = () => {
    if (boxSuggestionsRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        boxSuggestionsRef.current;

      const newState = { ...scrollState };
      newState[value] = boxSuggestionsRef.current.scrollTop > 0;
      setScrollState(newState);

      if (
        scrollTop + clientHeight >= scrollHeight - 50 &&
        hasMoreSuggestions &&
        !isLoading
      ) {
        loadMoreSuggestedUsers();
      }
    }
  };

  const handleSentRequestsScroll = () => {
    if (boxSentRequestsRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        boxSentRequestsRef.current;

      const newState = { ...scrollState };
      newState[value] = boxSentRequestsRef.current.scrollTop > 0;
      setScrollState(newState);

      if (
        scrollTop + clientHeight >= scrollHeight - 50 &&
        hasMoreSuggestions &&
        !isLoading
      ) {
        // loadMoreUsers();
      }
    }
  };

  const handleFriendsScroll = () => {
    if (boxFriendsRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = boxFriendsRef.current;

      const newState = { ...scrollState };
      newState[value] = boxFriendsRef.current.scrollTop > 0;
      setScrollState(newState);

      if (
        scrollTop + clientHeight >= scrollHeight - 50 &&
        hasMoreSuggestions &&
        !isLoading
      ) {
        // loadMoreUsers();
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    if (newValue === 1 || newValue === 2) {
      const tabLabels = ["Đã Gửi", "Bạn Bè"];
      const selectedTab = tabLabels[newValue - 1];

      if (!clickedTabs[selectedTab]) {
        setClickedTabs((prev) => ({
          ...prev,
          [selectedTab]: true,
        }));
        // alert(`Tab "${selectedTab}" đã được click lần đầu.`);
      }
    }

    // Cập nhật tab đang được chọn
    setValue(newValue);
  };

  const handleSearchPeople = async () => {
    if (searchPeople.length === 0) return;

    const result = await userContext.fetchSearchUsersByName(searchPeople);

    if (result.success) {
      setSearchSuggestedUserData(result.data);
      setIsSearchPeople(true);
    } else {
      setSearchSuggestedUserData([]);
      setIsSearchPeople(false);
    }
  };

  const handleSearchFriend = async () => {
    alert(searchFriend);
  };

  const handleKeyDown = async (e, type) => {
    if (e.key === "Enter") {
      if (type === "friend") {
        await handleSearchFriend();
      } else {
        await handleSearchPeople();
      }
    }
  };

  const handleAddFriend = async (user) => {
    alert(user);
  };

  const handleCancelAddFriend = async (user) => {
    alert(user);
  };

  const handleUnfriend = async (user) => {
    alert(user);
  };

  const handleViewProfile = (user) => {
    alert("View profile user");
  };

  return (
    <Box sx={{ width: "100%", padding: 1 }}>
      <Tabs
        value={value}
        onChange={handleTabChange}
        aria-label="tabs"
        sx={{
          mb: 2,
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-evenly",
          backgroundColor: "transparent",
          position: "relative",
          flexWrap: mobile ? "wrap" : "nowrap",
        }}
      >
        <Tab
          label="Gợi Ý"
          focusRipple
          sx={{
            color: "text.primary",
            paddingY: 1.5,
            paddingX: 4,
            textTransform: "none",
            "&.Mui-selected": {
              color: "primary.main",
              borderBottom: "3px solid",
              borderColor: "primary.main",
              transition: "border-color 0.3s ease",
            },
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.08)",
              transition: "background-color 0.3s ease",
            },
            "&:focus": {
              backgroundColor: "rgba(25, 118, 210, 0.2)",
              borderRadius: "4px",
            },
            ...(mobile && {
              paddingY: 1,
              paddingX: 2,
              fontSize: "0.9rem",
              textAlign: "center",
            }),
          }}
        />
        <Tab
          label={
            <Badge color="error" badgeContent={sentRequests.length || 0}>
              Đã Gửi
            </Badge>
          }
          focusRipple
          sx={{
            color: "text.primary",
            paddingY: 1.5,
            paddingX: 4,
            textTransform: "none",
            "&.Mui-selected": {
              color: "primary.main",
              borderBottom: "3px solid",
              borderColor: "primary.main",
            },
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.08)",
              transition: "background-color 0.3s ease",
            },
            "&:focus": {
              backgroundColor: "rgba(25, 118, 210, 0.2)",
              borderRadius: "4px",
            },
            ...(mobile && {
              paddingY: 1,
              paddingX: 2,
              fontSize: "0.9rem",
              textAlign: "center",
            }),
          }}
        />
        <Tab
          label="Bạn Bè"
          focusRipple
          sx={{
            color: "text.primary",
            paddingY: 1.5,
            paddingX: 4,
            textTransform: "none",
            "&.Mui-selected": {
              color: "primary.main",
              borderBottom: "3px solid",
              borderColor: "primary.main",
            },
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.08)",
              transition: "background-color 0.3s ease",
            },
            "&:focus": {
              backgroundColor: "rgba(25, 118, 210, 0.2)",
              borderRadius: "4px",
            },
            ...(mobile && {
              paddingY: 1,
              paddingX: 2,
              fontSize: "0.9rem",
              textAlign: "center",
            }),
          }}
        />
      </Tabs>

      {value === 0 && (
        <Box sx={{ padding: 1 }}>
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            fullWidth
            value={searchPeople}
            onChange={(e) => setSearchPeople(e.target.value)}
            sx={{ marginBottom: 1, fontSize: "14px" }}
            onKeyDown={(e) => handleKeyDown(e, "people")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start" onClick={handleSearchPeople}>
                  <IconButton>
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography
            variant="body1"
            sx={{
              marginBottom: 1,
              color: "gray",
              display: "flex",
              alignItems: "center",
            }}
          >
            Những người bạn có thể biết
            <InfoOutlined sx={{ marginLeft: 0.5, fontSize: 18 }} />
          </Typography>

          {isSearchPeople ? (
            <Box
              ref={boxSuggestionsRef}
              sx={{
                height: "calc(100vh - 210px)",
                overflowY: "auto",
                "&::-webkit-scrollbar": { display: "none" },
                borderTop: scrollState[0] ? "1px solid #e8e9eb" : "none",
                padding: 1,
              }}
            >
              <Grid container spacing={1}>
                {searchSuggestedUserData.map((user, index) => (
                  <Grid item xs={2.4} sm={2.4} md={2.4} key={index}>
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                          width: "90%",
                        }}
                      >
                        {/* Avatar */}
                        {clientInfo.getAvatarStyle(user)}
                        {/* Username */}
                        <Typography
                          variant="body2"
                          sx={{
                            textAlign: "center",
                            fontWeight: "bold",
                            marginBottom: 1,
                            color: "#333",
                            "&:hover": {
                              textDecoration: "underline",
                              cursor: "pointer",
                            },
                          }}
                          onClick={() => handleViewProfile(user)}
                        >
                          {user.username}
                        </Typography>

                        {/* Add Friend Button */}
                        <ResponsiveButton
                          variant="contained"
                          color="primary"
                          onClick={() => handleAddFriend(user)}
                          sx={{
                            width: "100%",
                            padding: "10px 0",
                            textTransform: "none",
                            fontWeight: "bold",
                            fontSize: "0.875rem",
                            "&:hover": {
                              backgroundColor: "#1976d2",
                            },
                          }}
                        >
                          Thêm bạn bè
                        </ResponsiveButton>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Box
              ref={boxSuggestionsRef}
              sx={{
                height: "calc(100vh - 210px)",
                overflowY: "auto",
                "&::-webkit-scrollbar": { display: "none" },
                borderTop: scrollState[0] ? "1px solid #e8e9eb" : "none",
                padding: 1,
              }}
            >
              <Grid container spacing={1}>
                {suggestions.map((user, index) => (
                  <Grid item xs={2.4} sm={2.4} md={2.4} key={index}>
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                          width: "90%",
                          padding: 2,
                        }}
                      >
                        {/* Avatar */}
                        {clientInfo.getAvatarStyle(user)}

                        {/* Username */}
                        <Typography
                          variant="body2"
                          sx={{
                            textAlign: "center",
                            fontWeight: "bold",
                            marginBottom: 1,
                            color: "#333",
                            "&:hover": {
                              textDecoration: "underline",
                              cursor: "pointer",
                            },
                          }}
                          onClick={() => handleViewProfile(user)}
                        >
                          {user.username}
                        </Typography>

                        {/* Add Friend Button */}
                        <ResponsiveButton
                          variant="contained"
                          color="primary"
                          onClick={() => handleAddFriend(user)}
                          sx={{
                            width: "100%",
                            padding: "10px 0",
                            textTransform: "none",
                            fontWeight: "bold",
                            fontSize: "0.875rem",
                            "&:hover": {
                              backgroundColor: "#1976d2",
                            },
                          }}
                        >
                          Thêm bạn bè
                        </ResponsiveButton>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      )}

      {value === 1 && (
        <Box sx={{ padding: 1 }}>
          <Typography
            variant="body1"
            sx={{
              marginBottom: 1,
              color: "gray",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ForwardToInbox
              sx={{ fontSize: "1.6rem", marginRight: 1, color: "gray" }}
            />
            Yêu cầu kết bạn đã gửi
          </Typography>

          <Box
            ref={boxSentRequestsRef}
            sx={{
              height: "calc(100vh - 155px)",
              overflowY: "scroll",
              "&::-webkit-scrollbar": { display: "none" },
              borderTop: scrollState[1] ? "1px solid #e8e9eb" : "none",
              padding: 1,
            }}
          >
            {sentRequests.length !== 0 ? (
              <Grid container spacing={1}>
                {sentRequests.map((user, index) => (
                  <Grid item xs={2.4} sm={2.4} md={2.4} key={index}>
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                          width: "90%",
                          padding: 2,
                        }}
                      >
                        {/* Avatar */}
                        {clientInfo.getAvatarStyle(user)}

                        {/* Username */}
                        <Typography
                          variant="body2"
                          sx={{
                            textAlign: "center",
                            fontWeight: "bold",
                            marginBottom: 1,
                            color: "#333",
                            "&:hover": {
                              textDecoration: "underline",
                              cursor: "pointer",
                            },
                          }}
                          onClick={() => handleViewProfile(user)}
                        >
                          {user.username}
                        </Typography>

                        {/* Cancel Request Button */}
                        <ResponsiveButton
                          variant="outlined"
                          color="error"
                          onClick={() => handleCancelAddFriend(user)}
                          sx={{
                            width: "100%",
                            padding: "10px 0",
                            textTransform: "none",
                            fontWeight: "bold",
                            fontSize: "0.875rem",
                            "&:hover": {
                              backgroundColor: "#f44336",
                              color: "#fff",
                            },
                          }}
                        >
                          Hủy yêu cầu
                        </ResponsiveButton>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography
                color="gray"
                align="center"
                style={{
                  fontStyle: "italic",
                  marginTop: "20px",
                  fontSize: "15px",
                }}
              >
                Hiện chưa gửi lời mời kết bạn nào
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {value === 2 && (
        <Box sx={{ padding: 1 }}>
          <TextField
            label="Tìm bạn"
            variant="outlined"
            fullWidth
            value={searchFriend}
            onChange={(e) => setSearchFriend(e.target.value)}
            sx={{ marginBottom: 1, fontSize: "14px" }}
            onKeyDown={(e) => handleKeyDown(e, "friend")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start" onClick={handleSearchFriend}>
                  <IconButton>
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box
            ref={boxFriendsRef}
            sx={{
              height: "calc(100vh - 180px)",
              overflowY: "scroll",
              "&::-webkit-scrollbar": { display: "none" },
              borderTop: scrollState[2] ? "1px solid #e8e9eb" : "none",
              padding: 1,
            }}
          >
            {suggestions.length !== 0 ? (
              <Grid container spacing={1}>
                {suggestions.map((friend, index) => (
                  <Grid item xs={2.4} sm={2.4} md={2.4} key={index}>
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CardContent
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                          width: "90%",
                          padding: 2,
                        }}
                      >
                        {/* Avatar */}
                        {clientInfo.getAvatarStyle(friend)}

                        {/* Username */}
                        <Typography
                          variant="body2"
                          sx={{
                            textAlign: "center",
                            fontWeight: "bold",
                            marginBottom: 1,
                            color: "#333",
                            "&:hover": {
                              textDecoration: "underline",
                              cursor: "pointer",
                            },
                          }}
                          onClick={() => handleViewProfile(friend)}
                        >
                          {friend.username}
                        </Typography>

                        {/* Friend Status */}
                        <Typography
                          variant="caption"
                          sx={{
                            color: "gray",
                            textTransform: "none",
                            marginBottom: 1,
                          }}
                        >
                          Bạn bè
                        </Typography>

                        {/* Unfriend Button */}
                        <ResponsiveButton
                          variant="contained"
                          color="error"
                          onClick={() => handleUnfriend(friend)}
                          sx={{
                            width: "100%",
                            padding: "10px 0",
                            textTransform: "none",
                            fontWeight: "bold",
                            fontSize: "0.875rem",
                            "&:hover": {
                              backgroundColor: "#f44336",
                              color: "#fff",
                            },
                          }}
                        >
                          Xóa kết bạn
                        </ResponsiveButton>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography
                color="gray"
                align="center"
                style={{
                  fontStyle: "italic",
                  marginTop: "20px",
                  fontSize: "15px",
                }}
              >
                Hiện chưa có người bạn nào
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default People;
