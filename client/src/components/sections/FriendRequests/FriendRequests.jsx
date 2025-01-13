import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
} from "@mui/material";

// Dữ liệu mẫu cho lời mời kết bạn
const friendRequests = [
  { id: 1, name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Trần Thị B", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Lê Văn C", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "Phạm Thị D", avatar: "https://i.pravatar.cc/150?img=4" },
];

const FriendRequests = () => {
  const handleAccept = (id) => {
    console.log(`Đã chấp nhận lời mời kết bạn từ ID: ${id}`);
  };

  const handleDecline = (id) => {
    console.log(`Đã từ chối lời mời kết bạn từ ID: ${id}`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Tiêu đề */}
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Lời mời kết bạn
      </Typography>

      {/* Hiển thị lời mời kết bạn theo dạng Grid */}
      <Grid container spacing={2}>
        {friendRequests.map((friend) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={friend.id}>
            <Card sx={{ textAlign: "center", padding: 2 }}>
              <Avatar
                src={friend.avatar}
                alt={friend.name}
                sx={{ width: 80, height: 80, margin: "0 auto", mb: 2 }}
              />
              <CardContent>
                <Typography variant="subtitle1" fontWeight="medium">
                  {friend.name}
                </Typography>
                <Box mt={2} display="flex" justifyContent="center" gap={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleAccept(friend.id)}
                  >
                    Chấp nhận
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDecline(friend.id)}
                  >
                    Từ chối
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Trường hợp không có lời mời kết bạn */}
      {friendRequests.length === 0 && (
        <Typography color="text.secondary" align="center" mt={5}>
          Hiện không có lời mời kết bạn nào.
        </Typography>
      )}
    </Box>
  );
};

export default FriendRequests;
