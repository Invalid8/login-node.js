const express = require("express");
const router = express.Router();
const chatBudddyController = require("../../controllers/chatBuddiesController");
const { checkAuthenticated } = require("../../config/isAuthenticated");

router
    .route("/")
    .get(checkAuthenticated, chatBudddyController.getAllChatBuddies)
    .post(checkAuthenticated, chatBudddyController.AddNewchatBuddy)
    .put(checkAuthenticated, chatBudddyController.updatechatBuddy)
    .delete(checkAuthenticated, chatBudddyController.deletechatBuddy);

router.route("/:id").get(chatBudddyController.getchatBuddy);

module.exports = router;
