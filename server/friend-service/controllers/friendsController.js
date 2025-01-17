const Friend = require("../models/Friend");
const { getUsersByIds } = require("../services/userService");

const getFriends = async (req, res) => {
  try {
    const userId = req.query.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = 18;
    const skip = (page - 1) * limit;

    const friends = await Friend.find({
      $or: [
        { sender: userId, status: { $in: ["accepted", "blocked"] } },
        { receiver: userId, status: { $in: ["accepted", "blocked"] } },
      ],
    })
      .skip(skip)
      .limit(limit);

    // Nếu không có bạn bè
    if (friends.length === 0) {
      return res.json({
        success: true,
        status: 200,
        message: "Không có người bạn nào",
        data: [],
      });
    }

    // Lấy danh sách các userId từ sender và receiver
    const friendIds = friends.map((item) =>
      item.sender.toString() === userId
        ? item.receiver.toString()
        : item.sender.toString()
    );

    // Lấy thông tin người dùng từ các ID bạn bè
    const friendData = await getUsersByIds(friendIds);

    if (friendData.success) {
      return res.json({
        success: true,
        status: 200,
        message: "Lấy danh sách bạn bè thành công",
        data: friendData.data,
        pagination: {
          page,
          limit,
          total: friendIds.length,
        },
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
      message: "Đã xảy ra lỗi khi lấy danh sách bạn bè",
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
          status: { $in: ["accepted", "blocked"] },
        },
        {
          receiver: { $in: connectedUserIds },
          sender: { $nin: [...connectedUserIds, userId] },
          status: { $in: ["accepted", "blocked"] },
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
    res.json({
      success: false,
      status: 500,
      message: `Lỗi server khi lấy danh sách người dùng liên quan: ${error.message}`,
    });
  }
};

const getFriendsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const friends = await Friend.find({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    const relatedUserIds = friends.map((friend) => {
      return friend.sender.toString() === userId
        ? friend.receiver
        : friend.sender;
    });

    res.json({
      success: true,
      status: 200,
      message: "Lấy danh sách ID người dùng liên quan thành công",
      data: relatedUserIds,
    });
  } catch (error) {
    console.log(
      `Lỗi server khi lấy danh sách người dùng liên quan: ${error.message}`
    );
    res.json({
      success: false,
      status: 500,
      message: `Lỗi server khi lấy danh sách người dùng liên quan: ${error.message}`,
    });
  }
};

const getAcceptedFriendRequestsBySender = async (req, res) => {
  const { userId } = req.params;

  try {
    const friendRequests = await Friend.find({
      sender: userId,
      status: { $in: ["accepted", "blocked"] },
      isConfirmed: false,
    });

    if (friendRequests.length === 0) {
      return res.json({
        success: true,
        status: 200,
        message: "Không có yêu cầu kết bạn nào thỏa mãn điều kiện",
        data: [],
      });
    }

    return res.json({
      success: true,
      status: 200,
      message: "Lấy danh sách yêu cầu kết bạn đã chấp nhận thành công",
      data: friendRequests,
    });
  } catch (error) {
    console.error("Lỗi khi lấy yêu cầu kết bạn đã chấp nhận:", error.message);
    return res.json({
      success: false,
      status: 500,
      message: "Đã xảy ra lỗi khi lấy yêu cầu kết bạn đã chấp nhận",
    });
  }
};

module.exports = {
  getFriends,
  getUserConnections,
  getFriendsByUserId,
  getAcceptedFriendRequestsBySender,
};
