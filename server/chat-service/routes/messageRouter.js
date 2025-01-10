const express = require("express");
const {
  getMessagesByConversation,
  createMessage,
} = require("../controllers/messageController");
const messageRouter = express.Router();

messageRouter.post("/getMessagesFromConversation", getMessagesByConversation);
messageRouter.post("/create", createMessage);

module.exports = messageRouter;
