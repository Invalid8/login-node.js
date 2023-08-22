const { checkAuthenticated } = require("../config/isAuthenticated");

const router = require("express").Router();

router.get('/', checkAuthenticated, (req, res) => {
    res.render("chatApp.ejs", { id: req.user.id, username: req.user.name, email: req.user.email })
})

module.exports = router;
