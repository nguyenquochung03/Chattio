const express = require("express");
const {
  addFriend,
  getFriendRequests,
  acceptFriendRequest,
  getFriends,
} = require("../controllers/friendController");
const friendRouter = express.Router();

friendRouter.post("/add", addFriend);
friendRouter.get("/getFriendRequests", getFriendRequests);
friendRouter.post("/acceptFriendRequest", acceptFriendRequest);
friendRouter.get("/getFriends", getFriends);
module.exports = friendRouter;
