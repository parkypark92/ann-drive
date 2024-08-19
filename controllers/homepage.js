const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.homepage_get = (req, res, next) => {
  res.render("index", { title: "Express" });
};

module.exports.login_get = (req, res, next) => {
  res.render("login", { title: "Login" });
};

module.exports.signup_get = (req, res, next) => {
  res.render("signup", { title: "Signup" });
};

module.exports.signup_post = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  await prisma.user.create({
    data: {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
    },
  });
  res.redirect("/");
});
