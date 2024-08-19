var express = require("express");
var router = express.Router();
const controller = require("../controllers/homepage");

/* GET home page. */
router.get("/", controller.homepage_get);
router.get("/login", controller.login_get);
router.get("/signup", controller.signup_get);
router.post("/signup", controller.signup_post);

module.exports = router;
