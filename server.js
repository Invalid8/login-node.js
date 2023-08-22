if (process.env.NODE_ENV !== "production") require("dotenv").config();

const express = require("express");
const app = express();

const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const bodyParser = require("body-parser");

var createError = require("http-errors");

const initializePassport = require("./config/passport-config.js");
const { checkNotAuthenticated, checkAuthenticated } = require("./config/isAuthenticated.js");
const usersDB = require("./model/users.js");

initializePassport(
	passport,
	(email) => usersDB.users.find((user) => user.email === email),
	(id) => usersDB.users.find((user) => user.id === id)
);

app.set("view-engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use(flash());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

app.use("/", require("./routes/index.js"));
app.use("/Login", require("./routes/loginPage.js"));
app.use("/Register", require("./routes/registerPage.js"));
app.use("/Chat", require("./routes/chat.js"));
app.use("/logout", require("./routes/logout.js"))

app.use("/chatBuddies", require("./routes/api/chatBuddies.js"));
app.use("/chatMessages", require("./routes/api/chatMessage.js"));
app.use("/getBuddyId", require("./routes/budId.js"))

app.use('/chatBuddies/:id', checkAuthenticated, require("./model/replyChat.js"))
app.use("/App", require("./routes/chatApp.js"))

app.post(
	"/login",
	checkNotAuthenticated,
	passport.authenticate("local", {
		successRedirect: "/App",
		failureRedirect: "/Login",
		failureFlash: true,
	})
);

app.post(
	"/register",
	checkNotAuthenticated,
	async (req, res) => {
		try {
			const hashedPassword = await bcrypt.hash(req.body.password, 10);
			const newUser = {
				id: Date.now().toString(),
				name: req.body.name.toLowerCase(),
				email: req.body.email,
				password: hashedPassword,
			};
			console.log(newUser)
			usersDB.setUsers([...usersDB.users, newUser])
			res.redirect("/Login");
		} catch {
			res.redirect("/Register");
		}
	}
);

//apply to all http methods
app.use("*", (req, res) => {
	res.status(404);
	if (req.accepts("ejs")) {
		res.render("404.ejs");
	} else if (req.accepts("json")) {
		res.json({ error: "404 Not Found" });
	} else {
		res.type("txt").send("404 Not Found");
	}
});

app.use(function (req, res, next) {
	next(createError(404));
});

module.exports = app;
