const Conversation = require("../models/Conversation");
const axios = require("axios");

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

const createConversation = async (req, res) => {
  const { userId1, userId2 } = req.body;
  const userIds = [userId1, userId2];

  try {
    // Kiểm tra xem hai người dùng có tồn tại không
    const usersData = await getUsersByIds(res, userIds);

    if (userIds.length !== usersData.length) {
      return res.json({
        success: false,
        status: 404,
        message: "Một trong hai người dùng không tồn tại",
      });
    }

    // Kiểm tra xem cuộc trò chuyện đã tồn tại giữa hai người này chưa
    const existingConversation = await Conversation.findOne({
      participants: { $size: 2, $all: [userId1, userId2] },
    });

    if (existingConversation) {
      return res.json({
        success: false,
        status: 400,
        message: "Cuộc trò chuyện đã tồn tại giữa hai người dùng này",
      });
    }

    // Tạo một cuộc trò chuyện mới
    const newConversation = new Conversation({
      participants: [userId1, userId2],
    });

    // Lưu cuộc trò chuyện vào cơ sở dữ liệu
    const savedConversation = await newConversation.save();

    return res.json({
      success: true,
      status: 201,
      message: "Tạo cuộc trò chuyện mới thành công",
      data: savedConversation,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      status: 500,
      message: "Lỗi khi tạo cuộc trò chuyện mới",
    });
  }
};

const getConversation = async (req, res) => {
  const { userId1, userId2 } = req.body;
  const userIds = [userId1, userId2];

  try {
    // Kiểm tra xem hai người dùng có tồn tại không
    const usersData = await getUsersByIds(res, userIds);

    if (userIds.length !== usersData.length) {
      return res.json({
        success: false,
        status: 404,
        message: "Một trong hai người dùng không tồn tại",
      });
    }

    // Kiểm tra xem cuộc trò chuyện đã tồn tại giữa hai người này chưa
    const conversation = await Conversation.findOne({
      participants: { $size: 2, $all: [userId1, userId2] },
    });

    if (!conversation) {
      return res.json({
        success: false,
        status: 400,
        message: "Cuộc trò chuyện chưa tồn tại giữa hai người dùng này",
      });
    }

    return res.json({
      success: true,
      status: 201,
      message: "Lấy thông tin cuộc trò chuyện thành công",
      data: conversation,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      status: 500,
      message: "Lỗi khi lấy thông tin cuộc trò chuyện",
    });
  }
};

module.exports = { createConversation, getConversation };
