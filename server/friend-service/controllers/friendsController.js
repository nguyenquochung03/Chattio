const Friend = require("../models/Friend");
const { getUsersByIds } = require("../services/userService");

const getFriends = async (req, res) => {
  try {
    const { userId } = req.params;

    const senders = await Friend.find({
      sender: userId,
      status: { $in: ["accepted", "blocked"] },
    });

    const receivers = await Friend.find({
      receiver: userId,
      status: { $in: ["accepted", "blocked"] },
    });

    if (senders.length === 0 && receivers.length === 0) {
      return res.json({
        success: true,
        status: 200,
        message: "Không có người bạn nào",
        data: [],
      });
    }

    const senderIds = senders.map((item) => item.receiver.toString());
    const receiverIds = receivers.map((item) => item.sender.toString());
    const friendIds = [...senderIds, ...receiverIds];

    const friendData = await getUsersByIds(friendIds);

    if (friendData.success) {
      return res.json({
        success: true,
        status: 200,
        message: "Truy cập danh sách bạn bè thành công",
        data: friendData.data,
      });
    } else {
      return res.json({
        success: false,
        status: friendData.status,
        message: friendData.message,
      });
    }
  } catch (error) {
    console.error("Lỗi lấy danh sách bạn bè:", error.message);
    return res.json({
      success: false,
      status: 500,
      message: "Đã xảy ra lỗi khi lấy danh bạn bè",
    });
  }
};

const getUserConnections = async (req, res) => {
  try {
    const { userId } = req.params;

    // Lấy danh sách bạn bè đã kết nối
    const friendsAndRequests = await Friend.find({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    const connectedUserIds = friendsAndRequests.map((item) =>
      item.sender.equals(userId) ? item.receiver : item.sender
    );

    // Tìm bạn chung (mutual friends)
    const mutualFriends = await Friend.find({
      $or: [
        {
          sender: { $in: connectedUserIds },
          receiver: { $nin: [...connectedUserIds, userId] },
          status: { $in: ["accepted", "rejected", "blocked"] },
        },
        {
          receiver: { $in: connectedUserIds },
          sender: { $nin: [...connectedUserIds, userId] },
          status: { $in: ["accepted", "rejected", "blocked"] },
        },
      ],
    }).select("sender receiver");

    const mutualFriendIds = mutualFriends.map((f) =>
      f.sender.equals(userId) ? f.receiver : f.sender
    );

    res.json({
      success: true,
      status: 200,
      message: "Lấy danh sách ID người dùng liên quan thành công",
      data: {
        connectedUserIds,
        mutualFriendIds,
      },
    });
  } catch (error) {
    console.log(
      `Lỗi server khi lấy danh sách người dùng liên quan: ${error.message}`
    );
    res.status(500).json({
      success: false,
      status: 500,
      message: `Lỗi server khi lấy danh sách người dùng liên quan: ${error.message}`,
    });
  }
};

module.exports = {
  getFriends,
  getUserConnections,
};
