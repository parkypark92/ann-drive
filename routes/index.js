var express = require("express");
var router = express.Router();
const controller = require("../controllers/homepage");
const validate = require("../utils/validate");
const passport = require("passport");
require("../config/passport");

router.get("/", controller.homepage_get);
router.get("/login", controller.login_get);
router.post(
  "/login",
  controller.reset_messages,
  passport.authenticate("local", {
    failureMessage: true,
    failureRedirect: "/login?success=false",
    successRedirect: "/",
  })
);
router.get("/logout", controller.logout_get);
router.get("/signup", controller.signup_get);
router.post("/signup", validate.sign_up, controller.signup_post);

module.exports = router;
