var express = require("express");
var router = express.Router();
const controller = require("../controllers/user");
const isAuth = require("../config/passport").isAuth;
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/:id", isAuth, controller.user_homepage_get);
router.get("/:id/folders/:folderId", isAuth, controller.folder_get);
router.get("/:id/create", isAuth, controller.create_folder_get);
router.post("/:id/create", isAuth, controller.create_folder_post);
router.get(
  "/:id/folders/:folderId/delete",
  isAuth,
  controller.delete_folder_get
);
router.post(
  "/:id/folders/:folderId/delete",
  isAuth,
  controller.delete_folder_post
);
router.get("/:id/folders/:folderId/upload", isAuth, controller.upload_form_get);
router.post(
  "/:id/folders/:folderId/upload",
  isAuth,
  upload.single("uploaded_file"),
  controller.upload_form_post
);
router.get("/:id/folders/:folderId/:fileId", isAuth, controller.file_get);
router.get(
  "/:id/folders/:folderId/:fileId/download",
  isAuth,
  controller.download_get
);
router.post(
  "/:id/folders/:folderId/:fileId/delete",
  isAuth,
  controller.delete_file_post
);

module.exports = router;
