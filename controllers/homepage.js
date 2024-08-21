const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const generatePassword = require("../utils/passwordUtils").generatePassword;

module.exports.homepage_get = (req, res, next) => {
  if (req.user) {
    res.redirect("/users/" + req.user.id);
  } else {
    res.render("index", { title: "Home" });
  }
};

module.exports.login_get = (req, res, next) => {
  if (req.user) res.redirect("/");
  if (req.query.success === "false") {
    res.render("login", { title: "Login", messages: req.session.messages });
  } else {
    res.render("login", { title: "Login" });
  }
};

exports.logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) next(err);
    res.redirect("/");
  });
};

module.exports.reset_messages = (req, res, next) => {
  req.session.messages = [];
  next();
};

module.exports.signup_get = (req, res, next) => {
  res.render("signup", { title: "Signup" });
};

module.exports.signup_post = asyncHandler(async (req, res, next) => {
  const hashAndSalt = generatePassword(req.body.password);
  const salt = hashAndSalt.salt;
  const hash = hashAndSalt.hash;
  await prisma.user.create({
    data: {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      salt: salt,
      hash: hash,
    },
  });
  res.redirect("/");
});
