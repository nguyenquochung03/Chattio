const express = require("express");
const cors = require("cors");
const http = require("http");
const { createProxyMiddleware } = require("http-proxy-middleware");
const socketIo = require("socket.io");
const axios = require("axios");
const {
  setRedisData,
  getRedisData,
  deleteRedisData,
  getAllUserSocketsKeys,
} = require("./redisServer");
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

// Lưu trữ socket của các người dùng
io.on("connection", (socket) => {
  socket.on("register", async (data) => {
    const { userId } = data;
    const userKey = `userSockets:${userId}`;
    // Lấy dữ liệu đã lưu trữ trong Redis
    const result = await getRedisData(userKey);

    if (result.success) {
      const sockets = result.data;
      // Kiểm tra nếu socket đã tồn tại trong danh sách
      if (!sockets.some((s) => s === socket.id)) {
        sockets.push(socket);
        // Cập nhật lại danh sách socket vào Redis
        await setRedisData(userKey, sockets);
      }
    } else {
      // Nếu chưa có dữ liệu, tạo mới danh sách socket
      setRedisData(userKey, [socket]);
    }
  });

  // Lắng nghe sự kiện thêm bạn bè
  socket.on("add-friend", async (data) => {
    const userKey = `userSockets:${data.receiverId}`;
    const result = await getRedisData(userKey);
    // Cập nhật từ id thành user và sau đó cập nhật ở client
    if (result.success) {
      socket.to(result.data).emit("add-friend", { sender: data.sender });
    }
  });

  // Lắng nghe sự kiện hủy lời mời kết bạn
  socket.on("cancel-request", async (data) => {
    const userKey = `userSockets:${data.receiverId}`;
    const result = await getRedisData(userKey);
    // Cập nhật từ id thành user và sau đó cập nhật ở client
    if (result.success) {
      socket.to(result.data).emit("cancel-request", { sender: data.sender });
    }
  });

  // Lắng nghe sự kiện từ chối lời mời kết bạn
  socket.on("reject-friend-request", async (data) => {
    const userKey = `userSockets:${data.senderId}`;
    const result = await getRedisData(userKey);
    // Cập nhật từ id thành user và sau đó cập nhật ở client
    if (result.success) {
      socket
        .to(result.data)
        .emit("reject-friend-request", { receiver: data.receiver });
    }
  });

  // Lắng nghe sự kiện đồng ý lời mời kết bạn
  socket.on("accept-friend-request", async (data) => {
    const userKey = `userSockets:${data.senderId}`;
    const result = await getRedisData(userKey);
    // Cập nhật từ id thành user và sau đó cập nhật ở client
    if (result.success) {
      socket
        .to(result.data)
        .emit("accept-friend-request", { receiver: data.receiver });
    }
  });

  socket.on("disconnect", async () => {
    // Xử lý ngắt kết nối cho từng người dùng
    const allUserIds = await getAllUserSocketsKeys("userSockets:*");

    for (let userKey of allUserIds.data) {
      const result = await getRedisData(userKey);
      if (result.success) {
        const sockets = result.data;
        const index = sockets.indexOf(socket.id);
        if (index !== -1) {
          sockets.splice(index, 1);
          if (sockets.length === 0) {
            await deleteRedisData(userKey);
          } else {
            await setRedisData(userKey, sockets);
          }
        }
      }
    }
  });
});

server.listen(port, () => {
  console.log(`API Gateway đang chạy trên http://localhost:${port}`);
});
