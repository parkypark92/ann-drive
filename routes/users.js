var express = require("express");
var router = express.Router();
const controller = require("../controllers/user");
const isAuth = require("../config/passport").isAuth;
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const supabase = require("../config/supabase");
const { decode } = require("base64-arraybuffer");

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
router.get("/:id/upload", isAuth, controller.upload_form_get);
router.post("/:id/upload", upload.single("uploaded_file"), (req, res, next) => {
  console.log(req.file);
  res.redirect("/");
});
module.exports = router;
