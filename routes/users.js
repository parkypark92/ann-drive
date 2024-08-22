var express = require("express");
var router = express.Router();
const controller = require("../controllers/user");

router.get("/:id", controller.user_homepage_get);
router.get("/:id/folders/:folderId", controller.folder_get);
router.get("/:id/create", controller.create_folder_get);
router.post("/:id/create", controller.create_folder_post);
router.get("/:id/folders/:folderId/delete", controller.delete_folder_get);
router.post("/:id/folders/:folderId/delete", controller.delete_folder_post);

module.exports = router;
