const express = require("express");
const passport = require("passport");
const router = express.Router();
const { v4 } = require("uuid");
const User = require("../data/models/User");
const PasswordReset = require("../data/models/PasswordReset");
const sendMail = require("../helpers/send-mail");
const dotenv = require("dotenv");
dotenv.config();

//Signup routes
router.get("/signup", (req, res) => {
  res.render("user/signup");
});

router.post("/signup", (req, res) => {
  User.register(
    new User({
      email: req.body.email,
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/auth/signup");
      }
      passport.authenticate("local")(req, res, () => {
        res.sendStatus(200);
      });
    }
  );
});

//Login routes
router.get("/login", (req, res) => {
  res.render("user/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  }),
  (req, res) => {}
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Password reset routes

router.get("/reset", (req, res) => {
  res.render("user/reset");
});

router.post("/reset", async (req, res) => {
  const token = v4().toString().replace(/-/g, "");
  try {
    const user = await User.findOne({ email: req.body.email });

    await PasswordReset.updateOne(
      { user: user._id },
      {
        user: user._id,
        token: token,
      },
      { upsert: true }
    );
    const link = process.env.DOMAIN + "/auth/reset/confirm/" + token;

    sendMail(user.email, link);

    res.redirect("/auth/login");
  } catch (e) {
    res.redirect("/auth/reset");
  }
});

router.get("/reset/confirm/:token", async (req, res) => {
  const token = req.params.token;
  const passwordReset = await PasswordReset.findOne({ token: token });
  if (passwordReset) {
    res.render("user/setpassword", { token: token });
  } else {
    res.send("Invalid token");
  }
});

router.post("/reset/confirm/:token", async (req, res) => {
  const token = req.params.token;
  try {
    const passwordReset = await PasswordReset.findOne({ token: token });
    const user = await User.findById(passwordReset.user);
    user.setPassword(req.body.password, (err, user) => {
      if (err) {
        res.send("Unable to reset password");
      } else {
        user.save();
        res.sendStatus(200);
      }
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
