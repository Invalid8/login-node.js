const express = require("express");
const { checkNotAuthenticated } = require("../config/isAuthenticated");
const router = express.Router();

router.get("/", checkNotAuthenticated, (req, res) => {
    res.render("login.ejs");
})

module.exports = router;
