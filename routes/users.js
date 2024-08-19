var express = require("express");
var router = express.Router();
const controller = require("../controllers/user");

/* GET users listing. */
router.get("/:id", controller.user_homepage_get);

module.exports = router;
