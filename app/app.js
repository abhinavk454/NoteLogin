require("dotenv").config();
require("../config/db.mongodb");
const express = require("express");
const initializePassport = require("../middlewares/passport");
const passport = require("passport");
const session = require("express-session");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "abhinav",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);

const checkIsAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
};

const checkIsNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  }
  return next();
};

app.get("/", (req, res) => {
  console.log(req.user.username);
  res.send("Hello from dev");
});

app.post("/fail", (req, res) => {
  res.status(401).send("Hello fail.");
});

app.post(
  "/signin",
  checkIsNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/fail",
    // failureFlash: true,
  })
);

app.post("/signup", checkIsNotAuthenticated, async (req, res, next) => {
  const { username, password } = req.body;
  if (!(username && password)) {
    res.status(400).json({ message: "Body is required" });
  }

  //check for already existing user
  const oldUser = await User.findOne({ username });

  if (oldUser) {
    res.status(409).json({ message: "User already exists please sign in." });
  } else {
    try {
      const encryptedPass = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: encryptedPass });
      await newUser.save();
      return res.status(200).json({ data: newUser });
    } catch (e) {
      res.status(400).json({ message: "Unknown Error" });
    }
  }
});

app.post("/", checkIsAuthenticated, (req, res, next) => {
  console.log(req.body);
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port} .`);
});
