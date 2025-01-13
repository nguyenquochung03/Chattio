const express = require("express");
const friendRouter = express.Router();
const {
  getFriends,
  getUserConnections,
} = require("../controllers/friendsController");

friendRouter.get("/list", getFriends);
friendRouter.get("/connectFriends/:userId", getUserConnections);

module.exports = friendRouter;
