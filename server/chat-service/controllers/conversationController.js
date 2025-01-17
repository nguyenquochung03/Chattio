const Conversation = require("../models/Conversation");
const axios = require("axios");
const { getUsersByIds } = require("../services/userService");

const createConversation = async (req, res) => {
  const { userId1, userId2 } = req.body;
  const userIds = [userId1, userId2];

  try {
    const usersData = await getUsersByIds(userIds);

    if (!usersData.success) {
      return res.json({
        success: false,
        status: usersData.status,
        message: usersData.message,
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
    console.error(`Lỗi khi tạo cuộc trò chuyện mới: ${error.message}`);
    return res.json({
      success: false,
      status: 500,
      message: `Lỗi khi tạo cuộc trò chuyện mới: ${error.message}`,
    });
  }
};

const getConversation = async (req, res) => {
  const { userId1, userId2 } = req.body;
  const userIds = [userId1, userId2];

  try {
    const usersData = await getUsersByIds(userIds);

    if (!usersData.success) {
      return res.json({
        success: false,
        status: usersData.status,
        message: usersData.message,
      });
    }

    // Kiểm tra xem cuộc trò chuyện đã tồn tại giữa hai người này chưa
    const existingConversation = await Conversation.findOne({
      participants: { $size: 2, $all: [userId1, userId2] },
    });

    if (!existingConversation) {
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
      data: existingConversation,
    });
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin cuộc trò chuyện: ${error.message}`);
    return res.json({
      success: false,
      status: 500,
      message: `Lỗi khi lấy thông tin cuộc trò chuyện: ${error.message}`,
    });
  }
};

module.exports = { createConversation, getConversation };
