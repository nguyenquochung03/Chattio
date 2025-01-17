const User = require("../models/User");
const {
  fetchConnectFriends,
  fetchGetFriendsByUserId,
} = require("../services/friendService");
const { getUsersByName } = require("../utils/userUtils");

const fetchUserProfileByToken = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.json({
        success: false,
        status: 404,
        message: "Không tìm thấy thông tin người dùng",
      });
    }

    return res.json({
      success: true,
      status: 200,
      message: "Lấy thông tin người dùng thành công",
      data: user,
    });
  } catch (error) {
    console.error("Lỗi server khi lấy thông tin người dùng:", error.message);
    return res.json({
      success: false,
      status: 500,
      message: "Lỗi server khi lấy thông tin người dùng, vui lòng thử lại",
    });
  }
};

const fetchUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        status: 404,
        message: "Không tìm thấy người dùng",
      });
    }

    const { _id, username, email, role, status, createdAt, updatedAt } = user;

    return res.json({
      success: true,
      status: 200,
      message: "Người dùng đã được tìm thấy",
      data: { _id, username, email, role, status, createdAt, updatedAt },
    });
  } catch (error) {
    console.error(
      "Xảy ra lỗi trong quá trình tìm kiếm người dùng qua ID:",
      error
    );
    return res.json({
      success: false,
      status: 500,
      message: `Lỗi server trong quá trình tìm kiếm người dùng qua ID: ${error.message}`,
    });
  }
};

const fetchUsersByIds = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.json({
        success: false,
        status: 400,
        message: "Danh sách ID không hợp lệ",
      });
    }

    const users = await User.find({ _id: { $in: userIds } });

    return res.json({
      success: true,
      status: 200,
      message: "Lấy thông tin người dùng thành công",
      data: users,
    });
  } catch (error) {
    console.error(
      `Lỗi máy chủ khi thực hiện lấy thông tin người dùng: ${error.message}`
    );
    return res.json({
      success: false,
      status: 500,
      message: `Lỗi máy chủ khi thực hiện lấy thông tin người dùng: ${error.message}`,
    });
  }
};

const searchUsersByUsername = async (req, res) => {
  const { username, userId } = req.query;

  const result = await getUsersByName(username, userId);

  if (result.success) {
    return res.json({
      success: true,
      status: result.status,
      message: result.message,
      data: result.data,
    });
  } else {
    return res.json({
      success: false,
      status: result.status,
      message: result.message,
    });
  }
};

const searchUsersByUsernameInSuggestions = async (req, res) => {
  const { username, userId } = req.query;

  try {
    const userByName = await getUsersByName(username, userId);

    if (!userByName.success) {
      return res.json({
        success: false,
        status: userByName.status,
        message: userByName.message,
      });
    }

    const friends = await fetchGetFriendsByUserId(userId);

    if (!friends.success) {
      return res.json({
        success: false,
        status: friends.status,
        message: friends.message,
      });
    }

    const friendIds = friends.data.map((id) => id.toString());

    const suggestedUsers = userByName.data.filter(
      (user) =>
        !friendIds.includes(user._id.toString()) &&
        user._id.toString() !== userId
    );

    if (suggestedUsers.length === 0) {
      return res.json({
        success: false,
        status: 404,
        message: "Không tìm thấy người dùng nào với tên này",
      });
    }

    res.json({
      success: true,
      status: 200,
      message: "Gợi ý người dùng thành công",
      data: suggestedUsers,
    });
  } catch (error) {
    console.error(`Lỗi server khi tìm kiếm người dùng: ${error.message}`);
    res.json({
      success: false,
      status: 500,
      message: `Lỗi server khi tìm kiếm người dùng: ${error.message}`,
    });
  }
};

const updateUserStatusById = async (req, res) => {
  const { status } = req.params;
  const userId = req.user._id;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );

    if (!user) {
      return res.json({
        success: false,
        status: 404,
        message: "Không tìm thấy người dùng",
      });
    }

    return res.json({
      success: true,
      status: 200,
      message: `Trạng thái người dùng ${user.username} đã được cập nhật thành công`,
      data: user.status,
    });
  } catch (error) {
    console.error("Không thể cập nhật trạng thái người dùng:", error.message);
    return res.json({
      success: false,
      status: 500,
      message: `Xảy ra lỗi trên server trong quá trình cập nhật trạng thái người dùng ${error.message}`,
      error: error.message,
    });
  }
};

const updateUserConversationId = async (req, res) => {
  try {
    const user = req.user;

    user.conversationId = req.body.conversationId;

    await user.save();

    return res.json({
      success: true,
      status: 200,
      message: "Cập nhật conversationStatus thành công.",
      data: user,
    });
  } catch (error) {
    console.error("Đã xảy ra lỗi khi cập nhật conversationId:", error);
    return res.json({
      success: false,
      status: 500,
      message: "Đã xảy ra lỗi khi cập nhật conversationId.",
    });
  }
};

const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = 18;
    const skip = (page - 1) * limit;

    // Gọi API lấy danh sách bạn bè và bạn chung
    const connectedResponse = await fetchConnectFriends(userId);

    if (!connectedResponse.success) {
      return res.json({
        success: false,
        status: connectedResponse.status,
        message: connectedResponse.message,
      });
    }

    const { connectedUserIds, mutualFriendIds } = connectedResponse.data;

    const suggestedUsers = await User.find({
      _id: { $nin: [...connectedUserIds, userId] },
    })
      .sort({
        _id: { $in: mutualFriendIds } ? -1 : 1,
      })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      status: 200,
      message: "Lấy danh sách gợi ý kết bạn thành công",
      data: suggestedUsers,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách gợi ý kết bạn:", error.message);
    res.json({
      success: false,
      status: 500,
      message: "Lỗi server khi lấy danh sách gợi ý kết bạn",
      error: error.message,
    });
  }
};

module.exports = {
  fetchUserProfileByToken,
  fetchUserById,
  searchUsersByUsername,
  fetchUsersByIds,
  updateUserStatusById,
  updateUserConversationId,
  getSuggestedUsers,
  searchUsersByUsernameInSuggestions,
};
