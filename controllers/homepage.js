const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const generatePassword = require("../utils/passwordUtils").generatePassword;
const { validationResult } = require("express-validator");
const supabase = require("../config/supabase").supabase;

module.exports.homepage_get = (req, res, next) => {
  if (req.user) {
    res.redirect("/users/" + req.user.id);
  } else {
    res.render("index", { title: "Home" });
  }
};

module.exports.login_get = (req, res, next) => {
  if (req.user) {
    res.redirect("/");
  }
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
  res.render("signup", { title: "Sign up" });
};

module.exports.signup_post = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const signupDetails = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
    };
    res.render("signup", {
      title: "Signup",
      details: signupDetails,
      errors: errors.array(),
    });
  } else {
    const hashAndSalt = generatePassword(req.body.password);
    const salt = hashAndSalt.salt;
    const hash = hashAndSalt.hash;
    const newUser = await prisma.user.create({
      data: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        email: req.body.email,
        salt: salt,
        hash: hash,
      },
    });
    const { data, error } = await supabase.storage.createBucket(newUser.id, {
      public: true,
    });
    res.redirect("/");
  }
});
