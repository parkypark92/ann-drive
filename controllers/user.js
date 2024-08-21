const asyncHandler = require("express-async-handler");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.create_folder_get = (req, res, next) => {
  res.render("folder_create", { title: "Create Folder" });
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
