var express = require("express");
var router = express.Router();
const controller = require("../controllers/homepage");
const passport = require("passport");
require("../config/passport");

router.get("/", controller.homepage_get);
router.get("/login", controller.login_get);
router.post(
  "/login",
  controller.reset_messages,
  passport.authenticate("local", {
    failureRedirect: "/login?success=false",
    failureMessage: true,
    successRedirect: "/",
  })
);
router.get("/logout", controller.logout_get);
router.get("/signup", controller.signup_get);
router.post("/signup", controller.signup_post);

module.exports = router;
