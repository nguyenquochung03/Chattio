const express = require("express");
const {
  createConversation,
  getConversation,
} = require("../controllers/conversationController");
const conversationRouter = express.Router();

conversationRouter.post("/create", createConversation);
conversationRouter.post("/get", getConversation);

module.exports = conversationRouter;
