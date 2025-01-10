const axios = require("axios");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const getMessagesByConversation = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    // Tìm cuộc hội thoại dựa trên participants
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      return res.json({
        success: false,
        status: 404,
        message: "Cuộc trò chuyện không được tìm thấy",
      });
    }

    // Lấy tất cả tin nhắn thuộc về cuộc hội thoại
    const messages = await Message.find({
      conversation: conversation._id,
    }).sort({ createdAt: 1 }); // Sắp xếp theo thời gian tăng dần

    res.json({
      success: true,
      status: 200,
      message: "Lấy tin nhắn trong cuộc trò chuyện thành công",
      data: messages,
    });
  } catch (error) {
    console.error("Xảy ra lỗi khi tải tin nhắn:", error);
    res.json({
      success: false,
      status: 500,
      message: "Xảy ra lỗi khi tải tin nhắn",
    });
  }
};

const createMessage = async (req, res) => {
  const {
    senderId,
    receiverId,
    conversationId,
    messageContent,
    status,
    createdAt,
  } = req.body;

  try {
    // Tạo đối tượng tin nhắn mới
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      conversation: conversationId,
      message: messageContent,
      status: status,
      createdAt: createdAt,
    });

    const savedMessage = await newMessage.save();

    return res.json({
      success: true,
      status: 200,
      message: "Tin nhắn đã được tạo",
      data: savedMessage,
    });
  } catch (error) {
    console.error("Lỗi khi tạo tin nhắn:", error);
    throw error; // Ném lỗi nếu có
  }
};

module.exports = { getMessagesByConversation, createMessage };
