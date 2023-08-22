const express = require("express");
const chatBudId = require("../model/chatbudId");
const router = express.Router();

router.post("/", (req, res) => {
    chatBudId.setId(parseInt(req.body.id));
    console.log("changed buddy")
})

module.exports = router
