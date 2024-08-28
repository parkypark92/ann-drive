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
    include: {
      files: true,
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

module.exports.upload_form_get = asyncHandler(async (req, res, next) => {
  const folder = await prisma.folder.findUnique({
    where: {
      id: req.params.folderId,
    },
  });
  res.render("upload_form", { title: "Upload", user: req.user, folder });
});

module.exports.upload_form_post = asyncHandler(async (req, res, next) => {
  try {
    const newFile = req.file;
    if (!newFile) {
      res.status(400).json({ message: "Please upload a file" });
      return;
    }
    const fileBase64 = decode(newFile.buffer.toString("base64"));
    const { data, error } = await supabase.storage
      .from(req.user.id)
      .upload(newFile.originalname, fileBase64);
    if (error) {
      throw error;
    }
    const { data: file } = supabase.storage
      .from(req.user.id)
      .getPublicUrl(data.path);
    await prisma.folder.update({
      where: {
        id: req.params.folderId,
      },
      data: {
        files: {
          create: {
            name: data.path,
            url: file.publicUrl,
          },
        },
      },
    });

    res.redirect(`/users/${req.user.id}/folders/${req.params.folderId}`);
  } catch (error) {
    console.log(error);
  }
});
