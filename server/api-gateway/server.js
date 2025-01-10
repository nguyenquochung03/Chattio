const express = require("express");
const cors = require("cors");
const http = require("http");
const { createProxyMiddleware } = require("http-proxy-middleware");
const socketIo = require("socket.io");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Chỉ parse body khi không dùng proxy
app.use((req, res, next) => {
  if (
    req.path.indexOf("/api/users") !== 0 &&
    req.path.indexOf("/api/chats") !== 0 &&
    req.path.indexOf("/api/friends") !== 0
  ) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

app.use((req, res, next) => {
  req.on("aborted", () => {
    console.error("Request aborted by the client.");
    res.status(499).send("Client Closed Request");
  });
  next();
});

// Proxy các request đến các dịch vụ microservices

app.use(
  "/api/users",
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/users": "" },
    onProxyReq: (proxyReq, req, res) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);

        // Cập nhật header
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));

        // Gửi dữ liệu body
        proxyReq.write(bodyData);
        proxyReq.end(); // Kết thúc request
      }
    },
    onError: (err, req, res) => {
      console.error("Proxy Error:", err.message);
      res.status(500).send("Proxy Error");
    },
  })
);

app.use(
  "/api/chats",
  createProxyMiddleware({
    target: process.env.CHAT_SERVICE_URL,
    changeOrigin: true,
    timeout: 10000,
    pathRewrite: { "^/api/chats": "" },
    onProxyReq: (proxyReq, req, res) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);

        // Cập nhật header
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));

        // Gửi dữ liệu body
        proxyReq.write(bodyData);
        proxyReq.end(); // Kết thúc request
      }
    },
    onError: (err, req, res) => {
      console.error("Proxy Error:", err.message);
      res.status(500).send("Proxy Error");
    },
  })
);

app.use(
  "/api/friends",
  createProxyMiddleware({
    target: process.env.FRIEND_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/friends": "" },
    onProxyReq: (proxyReq, req, res) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);

        // Cập nhật header
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));

        // Gửi dữ liệu body
        proxyReq.write(bodyData);
        proxyReq.end(); // Kết thúc request
      }
    },
    onError: (err, req, res) => {
      console.error("Proxy Error:", err.message);
      res.status(500).send("Proxy Error");
    },
  })
);

app.get("/", (req, res) => {
  res.send("Chào mừng đến với API Gateway!");
});

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  let userId = null; // Lưu trữ userId liên kết với socket.id

  // Lắng nghe sự kiện khi người dùng đăng nhập
  socket.on("userLogin", async (dataUpdate) => {
    try {
      const userData = await getUserDataByToken(dataUpdate.token);
      userId = userData._id; // Lưu lại userId để sử dụng khi ngắt kết nối

      // Cập nhật trạng thái người dùng
      const response = await axios.post(
        "http://localhost:3000/api/users/account/updateStatus",
        {
          userId: userData._id,
          status: dataUpdate.status,
        }
      );

      if (response.data.success) {
        // Phát sự kiện cập nhật trạng thái cho các client khác
        io.emit("user-status", {
          _id: userData._id,
          status: "online",
        });
      }
    } catch (error) {
      console.error("Lỗi khi xử lý userLogin:", error.message);
    }
  });

  socket.on("userLogout", async (dataUpdate) => {
    try {
      // Cập nhật trạng thái người dùng
      const response = await axios.post(
        "http://localhost:3000/api/users/account/updateStatus",
        {
          userId: userId,
          status: dataUpdate.status,
        }
      );

      if (response.data.success) {
        // Phát sự kiện cập nhật trạng thái cho các client khác
        io.emit("user-status", {
          _id: userId,
          status: "offline",
        });
      }
    } catch (error) {
      console.error("Lỗi khi xử lý userLogin:", error.message);
    }
  });

  socket.on("join", (conversationId) => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.leave(room);
      }
    }
    console.log(`User ${socket.id} joining room: ${conversationId}`);
    socket.join(conversationId);
  });

  socket.on("leave", (conversationId) => {
    socket.leave(conversationId);
  });

  // Lắng nghe sự kiện "typing"
  socket.on("typingStatus", (data) => {
    if (!data || !data.conversation || !data.conversation._id) {
      console.log("Invalid data received for typingStatus:", data);
      return;
    }

    const { conversation, status } = data;
    const { _id, participants } = conversation;

    // Kiểm tra xem có những ai đang ở trong phòng
    const participantsFromRoom = io.sockets.adapter.rooms.get(_id);

    if (participantsFromRoom) {
      // Gửi thông tin cho những người đang ở trong phòng
      socket.to(_id).emit("typing", { status });
    } else {
      console.log(`Room ${_id} not found or no participants.`);
    }
  });

  socket.on("sendMessage", async (data) => {
    const { conversation, message } = data;

    // Kiểm tra xem có những ai đang ở trong phòng
    const participantsFromRoom = io.sockets.adapter.rooms.get(conversation._id);

    if (participantsFromRoom) {
      if (participantsFromRoom.size !== conversation.participants.length) {
        message.status = "sent";

        const result = await createNewMessage(
          message.sender,
          message.receiver,
          conversation._id,
          message.message,
          message.status,
          message.createdAt
        );

        if (result.success) {
          socket.emit("updateMessageStatus", {
            _id: message._id,
            status: "sent",
          });

          socket.to(conversation._id).emit("receiveMessage", message);
        } else {
          console.error("Failed to create message:", result.message);
        }
      } else {
        message.status = "read";

        const result = await createNewMessage(
          message.sender,
          message.receiver,
          conversation._id,
          message.message,
          message.status,
          message.createdAt
        );

        if (result.success)
          socket.emit("updateMessageStatus", {
            _id: message._id,
            status: "read",
          });

        // Gửi tin nhắn mới cho các thành viên khác trong phòng
        socket.to(conversation._id).emit("receiveMessage", message);
      }
    } else {
      console.log(`Room ${conversation._id} not found or no participants.`);
    }
  });

  // Lắng nghe sự kiện khi người dùng ngắt kết nối
  socket.on("disconnect", async () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Hàm lấy thông tin người dùng từ token
const getUserDataByToken = async (token) => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/users/account/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data.success) {
      console.log(response.data.message);
      return;
    }

    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error.message);
    throw error;
  }
};

const createNewMessage = async (
  senderId,
  receiverId,
  conversationId,
  messageContent,
  status,
  createdAt
) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/chats/message/create",
      {
        senderId,
        receiverId,
        conversationId,
        messageContent,
        status,
        createdAt,
      }
    );

    // Kiểm tra thành công hay không
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message || "Message created successfully",
        data: response.data.data || null, // Trả về dữ liệu từ API nếu có
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to create message",
        data: null,
      };
    }
  } catch (error) {
    console.error("Error creating new message:", error.message);

    return {
      success: false,
      message: error.message || "An unknown error occurred",
      data: null,
    };
  }
};

server.listen(port, () => {
  console.log(`API Gateway đang chạy trên http://localhost:${port}`);
});
