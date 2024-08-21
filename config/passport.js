const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const validatePassword = require("../utils/passwordUtils").validatePassword;

const verifyCallback = async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) done(null, false, { message: "Incorrect username or password" });
    const isValid = validatePassword(password, user.salt, user.hash);
    if (isValid) {
      //user is passed to serializeUser
      return done(null, user, { message: "Success" });
    } else {
      return done(null, false, { message: "Incorrect username or password" });
    }
  } catch (err) {
    done(err);
  }
};

const strategy = new LocalStrategy(verifyCallback);
passport.use(strategy);

passport.serializeUser((user, done) => {
  //req.session.passport.user is set to user.id
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});
