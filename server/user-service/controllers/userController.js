const User = require("../models/User");

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

const searchUsersByUsernameForAddFriend = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.json({
        success: false,
        status: 400,
        message: "Tên người dùng không được bỏ trống",
      });
    }

    const users = await User.find({
      username: { $regex: username, $options: "i" },
    });

    if (users.length === 0) {
      return res.json({
        success: false,
        status: 404,
        message: "Không tìm thấy người dùng nào với tên này",
      });
    }

    return res.json({
      success: true,
      status: 200,
      message: "Tìm kiếm người dùng thành công",
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      status: 500,
      message: "Xảy ra lỗi khi tìm kiếm người dùng",
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

    const users = await User.find({ _id: { $in: userIds } }).select(
      "username email status"
    );

    return res.json({
      success: true,
      status: 200,
      message: "Lấy thông tin người dùng thành công",
      data: users,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      status: 500,
      message: `Lỗi máy chủ khi thực hiện lấy thông tin người dùng: ${error.message}`,
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

module.exports = {
  fetchUserProfileByToken,
  fetchUserById,
  searchUsersByUsernameForAddFriend,
  fetchUsersByIds,
  updateUserStatusById,
  updateUserConversationId,
};
