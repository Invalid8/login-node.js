const express = require("express");
const router = express.Router();
const chatMessageController = require("../../controllers/chatMessageController");
const { checkAuthenticated } = require("../../config/isAuthenticated");

router
	.route("/:id")
	.get(checkAuthenticated, chatMessageController.getAllChatMessages)
	.post(checkAuthenticated, chatMessageController.AddNewChatMessage)
	.put(checkAuthenticated, chatMessageController.updateChatMessage)
	.delete(checkAuthenticated, chatMessageController.deleteChatMessage);


router.route("/:id/:id").get(checkAuthenticated, chatMessageController.getChatMessage)
module.exports = router;
