const express = require("express");
const userRouter = express.Router();
const {
  fetchUserProfileByToken,
  fetchUserById,
  searchUsersByUsername,
  fetchUsersByIds,
  updateUserStatusById,
  updateUserConversationId,
  getSuggestedUsers,
  searchUsersByUsernameInSuggestions,
} = require("../controllers/userController.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");

userRouter.get("/me", authMiddleware, fetchUserProfileByToken);
userRouter.get("/profile/:userId", fetchUserById);
userRouter.get("/search/userName", searchUsersByUsername);
userRouter.get(
  "/searchSuggestions/userName",
  searchUsersByUsernameInSuggestions
);
userRouter.post("/search/usersIds", fetchUsersByIds);
userRouter.patch("/users/:userId/status", authMiddleware, updateUserStatusById);
userRouter.patch("/conversation", authMiddleware, updateUserConversationId);
userRouter.get("/suggestions", authMiddleware, getSuggestedUsers);

module.exports = userRouter;
