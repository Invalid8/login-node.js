const express = require("express");
const { checkNotAuthenticated } = require("../config/isAuthenticated");
const router = express.Router();

router.get("/", checkNotAuthenticated, (req, res) => {
    res.render("register.ejs");
})

module.exports = router;
