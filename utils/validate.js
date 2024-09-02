const { body } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.sign_up = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isAlpha()
    .withMessage("Name must only contain letters!"),
  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .isAlpha()
    .withMessage("Name must only contain letters!"),
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom(async (value) => {
      const nameTaken = await prisma.user.findUnique({
        where: {
          username: value,
        },
      });
      if (nameTaken) throw new Error("Username already in use!");
    }),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .escape()
    .custom(async (value) => {
      const emailTaken = await prisma.user.findUnique({
        where: {
          email: value,
        },
      });
      if (emailTaken) throw new Error("Email already in use!");
    }),
  body("confirm_password").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
];

exports.login = [body("username").trim().isLength({ min: 1 }).escape()];
