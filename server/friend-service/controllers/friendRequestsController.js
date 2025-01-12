const Friend = require("../models/Friend");
const { getUsersByIds } = require("../services/userService");
const { createConversation } = require("../services/chatService");

const addFriend = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    // Kiểm tra nếu sender và receiver là giống nhau, không thể kết bạn với chính mình
    if (senderId === receiverId) {
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
          sender: senderId,
          receiver: receiverId,
        },
        {
          sender: receiverId,
          receiver: senderId,
        },
      ],
    });

    if (existingFriendRequest) {
      return res.json({
        success: false,
        status: 400,
        message: "Đã gửi yêu cầu kết bạn đến người dùng này. Không thể gửi lại",
      });
    }

    // Tạo yêu cầu kết bạn mới
    const newFriendRequest = new Friend({
      sender: senderId,
      receiver: receiverId,
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
    console.error("Xảy ra lỗi khi gửi yêu cầu kết bạn: ", error.message);
    return res.json({
      success: false,
      status: 500,
      message: "Xảy ra lỗi khi gửi yêu cầu kết bạn: " + error.message,
    });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    // Tìm tất cả các yêu cầu kết bạn mà receiver là userId
    const friendRequests = await Friend.find({
      receiver: userId,
      status: "pending",
    });

    // Kiểm tra nếu không có yêu cầu nào
    if (friendRequests.length === 0) {
      return res.json({
        success: true,
        status: 200,
        message: "Không có yêu cầu kết bạn nào",
        data: [],
      });
    }

    // Lấy thông tin người muốn kết bạn đến người dùng từ danh sách yêu cầu kết bạn thông qua các id của họ
    const sender = friendRequests.map((request) => request.sender.toString());
    const dataOfSender = await getUsersByIds(sender);

    if (dataOfSender.success) {
      return res.json({
        success: true,
        status: 200,
        message: "Danh sách yêu cầu kết bạn",
        data: dataOfSender.data,
      });
    } else {
      return res.json({
        success: false,
        status: dataOfSender.status,
        message: dataOfSender.message,
      });
    }
  } catch (error) {
    console.error("Lỗi lấy danh sách yêu cầu kết bạn:", error.message);
    return res.json({
      success: false,
      status: 500,
      message: `Đã xảy ra lỗi khi lấy danh sách yêu cầu kết bạn ${error.message}`,
    });
  }
};

const acceptFriendRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    // Tìm mối quan hệ kết bạn giữa sender và receiver
    const friendRequest = await Friend.findOne({
      sender: senderId,
      receiver: receiverId,
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
    const newConversation = await createConversation(senderId, receiverId);

    if (newConversation.success) {
      // Cập nhật trạng thái của yêu cầu kết bạn thành "accepted"
      friendRequest.status = "accepted";
      await friendRequest.save();

      return res.json({
        success: true,
        status: 200,
        message: "Đã đồng ý kết bạn",
        data: friendRequest,
      });
    } else {
      return res.json({
        success: false,
        status: newConversation.status,
        message: newConversation.message,
      });
    }
  } catch (error) {
    console.error(`Lỗi máy chủ khi xử lý yêu cầu kết bạn: ${error.message}`);
    return res.json({
      success: false,
      status: 500,
      message: `Lỗi máy chủ khi xử lý yêu cầu kết bạn: ${error.message}`,
    });
  }
};

const rejectFriendRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    // Tìm mối quan hệ kết bạn giữa sender và receiver
    const friendRequest = await Friend.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    if (!friendRequest || friendRequest.status !== "pending") {
      return res.json({
        success: false,
        status: 404,
        message: "Yêu cầu kết bạn không tồn tại hoặc đã được xử lý",
      });
    }

    friendRequest.status = "rejected";
    await friendRequest.save();

    return res.json({
      success: true,
      status: 200,
      message: "Đã từ chối kết bạn",
      data: friendRequest,
    });
  } catch (error) {
    console.error(`Lỗi máy chủ khi xử lý yêu cầu kết bạn: ${error.message}`);
    return res.json({
      success: false,
      status: 500,
      message: `Lỗi máy chủ khi xử lý yêu cầu kết bạn: ${error.message}`,
    });
  }
};

module.exports = {
  addFriend,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
};
