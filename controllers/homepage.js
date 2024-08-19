module.exports.homepage_get = (req, res, next) => {
  res.render("index", { title: "Express" });
};

module.exports.login_get = (req, res, next) => {
  res.render("login", { title: "Login" });
};

module.exports.signup_get = (req, res, next) => {
  res.render("signup", { title: "Signup" });
};
