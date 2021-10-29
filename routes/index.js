const express = require("express");
const router = express.Router();
const { for_register } = require("../middleware/validator");
const passport = require("passport");
const bcrypt = require("bcrypt");
const initializePassport = require("../middleware/passport");
initializePassport(passport);
const {
  checkNotAuthenticated,
  checkAuthenticated,
} = require("../middleware/check");
const { User, Foods, Dellers, Orders } = require("../config/db");
/* GET home page. */
router.get("/", checkAuthenticated, async(req, res, next) => {
  let foods = await Foods.find()
  let orders = await Orders.find()
  let dellers = await Dellers.find()


  res.render("index", { title: "FOODEX Admin", user:req.user, foods:foods.length, orders:orders.length, dellers:dellers.length });
});

router.get("/login", checkNotAuthenticated, (req, res, next) => {
  res.render("login");
});

router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.delete("/logout", async (req, res) => {
  req.logOut();
  res.redirect("/login");
});

router.get("/register", checkNotAuthenticated, (req, res, next) => {
  res.render("register");
});

router.post("/register", checkNotAuthenticated, async (req, res) => {
  await for_register
    .validateAsync(req.body)
    .then(async () => {
      const { fullname, password, username, regkey } = req.body;

      if (!regkey && regkey !== process.env.REG_KEY) {
        res.locals.message = "Not Allowed";
        res.status(401);
        res.render("register");
      } else {
        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({
          fullname: fullname,
          username: username,
          password: hashPassword,
        })
          .then(() => {
            res.redirect('/login')
          })
          .catch((err) => res.status(400).send(err));
      }
    })
    .catch((err) => {
      if (err.details) {
        res.locals.message = err.details[0].message;
        res.status(500);
        res.render("register");
      }
    });
});

module.exports = router;
