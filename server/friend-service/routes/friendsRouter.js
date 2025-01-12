const express = require("express");
const friendRouter = express.Router();
const { getFriends } = require("../controllers/friendsController");

friendRouter.get("/list", getFriends);

module.exports = friendRouter;
