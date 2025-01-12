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

module.exports = {
  getFriends,
};
