const express = require("express");
const { checkAuthenticated } = require("../config/isAuthenticated");
const router = express.Router();

router.get('/', checkAuthenticated, (req, res) => {
    res.render("index.ejs", { name: req.user.name });
})

router.get("/random-color-gen", checkAuthenticated, (req, res) => {
    res.render("rand.ejs", { name: req.user.name });
});
router.get("/tic-tac-toe", checkAuthenticated, (req, res) => {
    res.render("tic.ejs", { name: req.user.name });
});

module.exports = router;
