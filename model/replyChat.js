const express = require("express");
const router = express.Router();
const fs = require("fs");

const EventEmitter = require("events");
const chatBudId = require("./chatbudId");
const { Profile, BuddyP } = require("../controllers/chatBuddiesController");

const { setBuddies, buddies } = require("./chat-buddies");
const { userId } = require("../config/isAuthenticated");
const chatEmitter = new EventEmitter();

router.get(`/chatReply`, respondChat)
router.get(`/sse`, respondSSE);

function respondChat(req, res) {
    const { message } = req.query;

    if (message) {
        const newHistory = JSON.parse(message)
        newHistory.id = Date.now().toString();

        const Buddy = Profile.userProfile.buddies.find(Bud => Bud.id === chatBudId.id);
        if (Buddy) Buddy.messages.push(newHistory)

        setBuddies(buddies);
    }

    chatEmitter.emit("message", message);
    res.end();
}

function respondSSE(req, res) {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
    });

    const onMessage = (msg) => res.write(`data: ${msg}\n\n`);
    chatEmitter.on("message", onMessage);

    res.on("close", function () {
        chatEmitter.off("message", onMessage);
    });
}

module.exports = router;
