const axios = require("axios");
const Friend = require("../models/Friend");

const addFriend = async (req, res) => {
  try {
    const { userId } = req.body;

    // Kiểm tra xem có token trong headers không
    const token = req.headers.authorization;
    if (!token) {
      return res.json({
        success: false,
        status: 401,
        message: "Token không hợp lệ hoặc thiếu token",
      });
    }

    // Gọi API từ user-service để lấy thông tin người dùng theo token
    const responseSender = await axios.get(
      `${process.env.BASE_URL}/api/users/account/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!responseSender.data.success) {
      return res.json({
        success: false,
        status: 404,
        message: responseSender.data.message,
      });
    }

    // Gọi API từ user-service để lấy thông tin người dùng theo mã tài khoản (ID) của người muốn kết bạn
    const responseReceiver = await axios.get(
      `${process.env.BASE_URL}/api/users/account/user/${userId}`
    );

    if (!responseReceiver.data.success) {
      return res.json({
        success: false,
        status: 404,
        message: responseReceiver.data.message,
      });
    }

    // Kiểm tra nếu sender và receiver là giống nhau, không thể kết bạn với chính mình
    if (responseSender.data.data._id === responseReceiver.data.data._id) {
      return res.json({
        success: false,
        status: 400,
        message: "Bạn không thể kết bạn với chính mình",
      });
    }

    // Kiểm tra nếu đã có kết bạn (2 người không thể kết bạn nhiều lần)
    const existingFriendRequest = await Friend.findOne({
      $or: [
        {
          sender: responseSender.data.data._id,
          receiver: responseReceiver.data.data._id,
        },
        {
          sender: responseReceiver.data.data._id,
          receiver: responseSender.data.data._id,
        },
      ],
    });

    if (existingFriendRequest) {
      return res.json({
        success: false,
        status: 400,
        message:
          "Đã gửi yêu cầu kết bạn đến người dùng này. Không thể gửi lại.",
      });
    }

    // Tạo yêu cầu kết bạn mới
    const newFriendRequest = new Friend({
      sender: responseSender.data.data._id,
      receiver: responseReceiver.data.data._id,
      status: "pending",
    });

    // Lưu yêu cầu kết bạn
    await newFriendRequest.save();

    return res.json({
      success: true,
      status: 200,
      message: "Yêu cầu kết bạn đã được gửi",
      data: newFriendRequest,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      status: 500,
      message: "Xảy ra lỗi khi gửi yêu cầu kết bạn: " + error.message,
    });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    // Kiểm tra xem có token trong headers không
    const token = req.headers.authorization;
    if (!token) {
      return res.json({
        success: false,
        status: 401,
        message: "Token không hợp lệ hoặc thiếu token",
      });
    }

    // Gọi API từ user-service để lấy thông tin người dùng theo token
    const response = await axios.get(
      `${process.env.BASE_URL}/api/users/account/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data.success) {
      return res.json({
        success: false,
        status: 404,
        message: response.data.message,
      });
    }

    // Tìm tất cả các yêu cầu kết bạn mà receiver là userId
    const friendRequests = await Friend.find({
      receiver: response.data.data._id,
      status: "pending",
    });

    // Kiểm tra nếu không có yêu cầu nào
    if (friendRequests.length === 0) {
      return res.json({
        success: true,
        status: 404,
        message: "Không có yêu cầu kết bạn nào",
        data: [],
      });
    }

    // Lấy thông tin người muốn kết bạn đến người dùng từ danh sách yêu cầu kết bạn thông qua các id của họ
    const sender = friendRequests.map((item) => item.sender.toString());

    const dataOfSender = await getUsersByIds(res, sender);

    // Trả về danh sách các yêu cầu kết bạn
    return res.json({
      success: true,
      status: 200,
      message: "Danh sách yêu cầu kết bạn",
      data: dataOfSender,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách yêu cầu kết bạn:", error.message);
    return res.json({
      success: false,
      status: 500,
      message: "Đã xảy ra lỗi khi lấy danh sách yêu cầu kết bạn",
    });
  }
};

const acceptFriendRequest = async (req, res) => {
  const { senderId } = req.body;

  if (!senderId) {
    return res.json({
      success: false,
      status: 404,
      message: "Thiếu thông tin sender",
    });
  }

  // Kiểm tra xem có token trong headers không
  const token = req.headers.authorization;
  if (!token) {
    return res.json({
      success: false,
      status: 401,
      message: "Token không hợp lệ hoặc thiếu token",
    });
  }

  // Gọi API từ user-service để lấy thông tin người dùng theo token
  const response = await axios.get(
    `${process.env.BASE_URL}/api/users/account/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.data.success) {
    return res.json({
      success: false,
      status: 404,
      message: response.data.message || "Không thể lấy thông tin người dùng",
    });
  }

  try {
    // Tìm mối quan hệ kết bạn giữa sender và receiver
    const friendRequest = await Friend.findOne({
      sender: senderId,
      receiver: response.data.data._id,
      status: "pending",
    });

    if (!friendRequest || friendRequest.status !== "pending") {
      return res.json({
        success: false,
        status: 404,
        message: "Yêu cầu kết bạn không tồn tại hoặc đã được xử lý",
      });
    }

    // Tạo cuộc họp thoại mới giữa hai người dùng
    const conversationResponse = await axios.post(
      `${process.env.BASE_URL}/api/chats/conversation/create`,
      {
        userId1: senderId,
        userId2: response.data.data._id,
      }
    );

    if (!conversationResponse.data.success) {
      return res.json({
        success: false,
        status: 404,
        message:
          conversationResponse.data.message || "Không thể tạo cuộc trò chuyện",
      });
    }

    // Cập nhật trạng thái của yêu cầu kết bạn thành "accepted"
    friendRequest.status = "accepted";
    await friendRequest.save();

    return res.json({
      success: true,
      status: 200,
      message: "Đã đồng ý kết bạn",
      data: friendRequest,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      status: 500,
      message: `Lỗi máy chủ khi xử lý yêu cầu kết bạn: ${error.message}`,
    });
  }
};

const getFriends = async (req, res) => {
  try {
    // Kiểm tra xem có token trong headers không
    const token = req.headers.authorization;
    if (!token) {
      return res.json({
        success: false,
        status: 401,
        message: "Token không hợp lệ hoặc thiếu token",
      });
    }

    // Gọi API từ user-service để lấy thông tin người dùng theo token
    const response = await axios.get(
      `${process.env.BASE_URL}/api/users/account/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data.success) {
      return res.json({
        success: false,
        status: 404,
        message: response.data.message,
      });
    }

    // Tìm tất cả các yêu cầu kết bạn mà sender là userId
    const senders = await Friend.find({
      sender: response.data.data._id,
      status: { $in: ["accepted", "blocked"] },
    });

    // Tìm tất cả các yêu cầu kết bạn mà receiver là userId
    const receivers = await Friend.find({
      receiver: response.data.data._id,
      status: { $in: ["accepted", "blocked"] },
    });

    // Kiểm tra nếu không có yêu cầu nào
    if (senders.length === 0 && receivers.length === 0) {
      return res.json({
        success: true,
        status: 404,
        message: "Không có người bạn nào",
        data: [],
      });
    }

    // Lấy thông tin người muốn kết bạn đến người dùng từ danh sách yêu cầu kết bạn thông qua các id của họ
    const senderIds = senders.map((item) => item.receiver.toString());
    const receiverIds = receivers.map((item) => item.sender.toString());
    const friendIds = [...senderIds, ...receiverIds];

    const friendData = await getUsersByIds(res, friendIds);

    // Trả về danh sách các yêu cầu kết bạn
    return res.json({
      success: true,
      status: 200,
      message: "Truy cập danh sách bạn bè thành công",
      data: friendData,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách bạn bè:", error.message);
    return res.json({
      success: false,
      status: 500,
      message: "Đã xảy ra lỗi khi lấy danh bạn bè",
    });
  }
};

const getUsersByIds = async (res, userIds) => {
  const response = await axios.post(
    "http://localhost:3000/api/users/account/getUsersByIds",
    { userIds }
  );

  if (!response.data.success) {
    return res.json({
      success: false,
      status: 404,
      message: response.data.message,
    });
  }

  return response.data.data;
};

module.exports = {
  addFriend,
  getFriendRequests,
  acceptFriendRequest,
  getFriends,
};
