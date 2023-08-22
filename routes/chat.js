const express = require("express");
const { checkAuthenticated } = require("../config/isAuthenticated");
const router = express.Router();

router.get('/', checkAuthenticated, (req, res) => {
    res.render("chat.ejs", { username: req.user.name, id: req.user.id })
})

router.post('/', checkAuthenticated, (req, res) => {
    res.render("chat.ejs")
})

module.exports = router;
