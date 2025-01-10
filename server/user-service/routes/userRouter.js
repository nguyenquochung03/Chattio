const express = require("express");
const userRouter = express.Router();
const {
  fetchUserProfileByToken,
  fetchUserById,
  searchUsersByUsernameForAddFriend,
  fetchUsersByIds,
  updateUserStatusById,
  updateUserConversationId,
} = require("../controllers/userController.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");

userRouter.get("/me", authMiddleware, fetchUserProfileByToken);
userRouter.get("/profile/:userId", fetchUserById);
userRouter.get("/search/userName", searchUsersByUsernameForAddFriend);
userRouter.post("/search/usersIds", fetchUsersByIds);
userRouter.patch("/users/:userId/status", authMiddleware, updateUserStatusById);
userRouter.patch("/conversation", authMiddleware, updateUserConversationId);

module.exports = userRouter;
