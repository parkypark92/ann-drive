var express = require("express");
var router = express.Router();
const controller = require("../controllers/user");

router.get("/:id", controller.user_homepage_get);
router.get("/:id/create", controller.create_folder_get);
router.post("/:id/create", controller.create_folder_post);

module.exports = router;
