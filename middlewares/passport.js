const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const initialize = (passport) => {
  const authenticateUser = async (username, password, done) => {
    const user = await User.findOne({ username });
    if (!user) {
      return done(null, false, { message: "User not found" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        done(null, user);
      } else {
        done(null, false, { message: "Wrong password" });
      }
    } catch (e) {
      done(e);
    }
  };
  passport.use(
    new LocalStrategy({ usernameField: "username" }, authenticateUser)
  );
  passport.serializeUser((user, done) => {});
  passport.deserializeUser((id, done) => {});
};

module.exports = initialize;
