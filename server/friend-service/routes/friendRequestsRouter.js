const express = require("express");
const {
  addFriend,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} = require("../controllers/friendRequestsController");
const friendRequestsRouter = express.Router();

friendRequestsRouter.post("/add", addFriend);
friendRequestsRouter.get("/request/:userId", getFriendRequests);
friendRequestsRouter.post("/accept", acceptFriendRequest);
friendRequestsRouter.post("/reject", rejectFriendRequest);

module.exports = friendRequestsRouter;
