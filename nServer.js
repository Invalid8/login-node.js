if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();

const bcrypt = require("bcryptjs");
const passport = require("passport");

const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

const users = require("./model/users.js");

const path = require("path");
const port = process.env.PORT | 3060;

const initializePassport = require("./config/passport-config.js");

initializePassport(
    passport,
    (email) => users.find((user) => user.email === email),
    (id) => users.find((user) => user.id === id)
);

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
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

app.get("/", checkAuthenticated, (req, res) => {
    res.render("index.ejs", { name: req.user.name });
});

app.get("/chat-buddy-login", checkAuthenticated, (req, res) => {
    res.render("c-index.ejs", { name: req.user.name });
});

app.get("/chat", checkAuthenticated, (req, res) => {
    res.render("chat.ejs", { name: req.user.name });
});

app.get("/random-color-gen", checkAuthenticated, (req, res) => {
    res.render("rand.ejs", { name: req.user.name });
});

app.get("/tic-tac-toe", checkAuthenticated, (req, res) => {
    res.render("tic.ejs");
});

app.post("/chat", checkAuthenticated, (req, res) => {
    res.render("chat.ejs");
});

app.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("login.ejs");
});

app.get("/chat-history", checkAuthenticated, (req, res) => {
    let reqPath = path.join(__dirname, "./data/db.json");

    fs.readFileSync(reqPath, "utf-8", (err, data) => {
        if (!err) {
            console.log("success");
            res.json(data)
            res.end(data);
        } else {
            res.end(err);
        }
    });
});

app.post(
    "/login",
    checkNotAuthenticated,
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
    })
);

app.get("/register", checkNotAuthenticated, (req, res) => {
    res.render("register.ejs");
});

app.post("/logout", function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });
        res.redirect("/login");
    } catch {
        res.redirect("/register");
    }
    console.log(users);
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
}

// window.open("./index.html");

EventEmitter = require("events");
chatEmitter = new EventEmitter();
const fs = require("fs");

app.get("/chatReply", respondChat);
app.get("/sse", respondSSE);

function respondChat(req, res) {
    const { message } = req.query;
    // const { username } = req.query;

    chatEmitter.emit("message", message);
    // chatEmitter.emit("username", username);
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
        // chatEmitter.off("username", onUsername);
    });
}

function respondNotFound(req, res) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
}

app.listen(port, () => {
    console.log(`Server is Running on PORT ${port}`);
});
