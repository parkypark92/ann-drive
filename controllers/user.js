const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const supabase = require("../config/supabase").supabase;
const { decode } = require("base64-arraybuffer");

module.exports.user_homepage_get = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      folders: true,
    },
  });
  res.render("user_home", { user: user });
});

module.exports.folder_get = asyncHandler(async (req, res, next) => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: req.params.folderId,
    },
  });
  res.render("folder", { title: "Folder", folder: folder, user: req.user });
});

module.exports.create_folder_get = (req, res, next) => {
  res.render("folder_create", { title: "Create Folder", user: req.user });
};

module.exports.create_folder_post = asyncHandler(async (req, res, next) => {
  await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      folders: {
        create: {
          name: req.body.name,
        },
      },
    },
  });
  res.redirect("/");
});

module.exports.delete_folder_get = asyncHandler(async (req, res, next) => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: req.params.folderId,
    },
  });
  res.render("delete_folder", { title: "Delete", folder, user: req.user });
});

module.exports.delete_folder_post = asyncHandler(async (req, res, next) => {
  await prisma.folder.delete({
    where: {
      id: req.body.folder_id,
    },
  });
  res.redirect("/");
});

module.exports.upload_form_get = (req, res, next) => {
  res.render("upload_form", { title: "Upload", user: req.user });
};

module.exports.upload_form_post = asyncHandler(async (req, res, next) => {
  try {
    const newFile = req.file;

    if (!newFile) {
      res.status(400).json({ message: "Please upload a file" });
      return;
    }

    // decode file buffer to base64
    const fileBase64 = decode(newFile.buffer.toString("base64"));

    // upload the file to supabase
    const { data, error } = await supabase.storage
      .from(req.user.id)
      .upload(newFile.originalname, fileBase64);

    if (error) {
      throw error;
    }

    // get public url of the uploaded file
    const { data: file } = supabase.storage
      .from(req.user.id)
      .getPublicUrl(data.path);

    console.log(file);
    res.status(200).json({ file: file.publicUrl });
  } catch (error) {
    console.log(error);
  }
});
