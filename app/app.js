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

app.get("/", (req, res) => {
  res.send("Hello from dev");
});
app.post("/signin", (req, res, next) => {});
app.post("/signup", async (req, res, next) => {
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

app.post("/", (req, res, next) => {});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port} .`);
});
