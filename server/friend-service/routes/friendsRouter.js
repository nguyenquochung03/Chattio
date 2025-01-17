const express = require("express");
const friendRouter = express.Router();
const {
  getFriends,
  getUserConnections,
  getFriendsByUserId,
} = require("../controllers/friendsController");

friendRouter.get("/list", getFriends);
friendRouter.get("/connectFriends/:userId", getUserConnections);
friendRouter.get("/friends/:userId", getFriendsByUserId);

module.exports = friendRouter;
