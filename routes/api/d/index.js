var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");
const { Dellers } = require("../../../config/db");
const {
  for_deller_register,
  for_deller_login,
} = require("../../../middleware/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const token = require("../../../middleware/token");
// const hbs = require("nodemailer-express-handlebars");
const { dellerUrl } = require("../../../constants");

router.use("/order", require("./routes/order"));
router.use("/foods", require("./routes/foods"));

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

transport.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

router.put("/user/generateQR", token, async (req, res, next) => {
  try {
    await Dellers.findByIdAndUpdate(req.user._id, { tableQR: req.body.tableQR })
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(204).send(err);
      });
  } catch (error) {
    res.status(500).send(error);
  }
});

// QR
router.get("/user/QR", token, async (req, res, next) => {
  try {
    await Dellers.findById(req.user._id)
      .then((data) => {
        res.status(200).send(data.tableQR);
      })
      .catch((err) => {
        res.status(204).send(err);
      });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Email Verification
router.get("/email_verify", async (req, res) => {
  try {
    await Dellers.findByIdAndUpdate(req.query.id, {
      access: true,
    })
      .then(() => {
        res.redirect(dellerUrl);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Email Verification Again
router.get("/verifyByEmail", token, async (req, res) => {
  try {
    await Dellers.findById(req.user._id)
      .then((result) => {
        host = req.get("host");
        link =
          "http://" + req.get("host") + "/api/d/email_verify?id=" + result._id;
        mailOptions = {
          from: `Food Export System <${process.env.EMAIL}>`,
          to: result.email,
          subject: "Please confirm your Email account",
          html: `<a href="${link}">Verif Your Account</a>`,
        };
        transport.sendMail(mailOptions, function (error, response) {
          if (error) {
            console.log(error);
            res.end(error);
          } else {
            res.status(200).send({ msg: "Please, check your email" });
          }
        });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Registration
router.post("/register", async (req, res) => {
  try {
    await for_deller_register
      .validateAsync(req.body)
      .then(async () => {
        const { fullname, password, username, address, number, email } =
          req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        await Dellers.create({
          fullname: fullname,
          address: address,
          phone: number,
          email: email,
          username: username,
          password: hashPassword,
        })
          .then((result) => {
            host = req.get("host");
            link =
              "http://" +
              req.get("host") +
              "/api/d/email_verify?id=" +
              result._id;
            mailOptions = {
              from: `Food Export System <${process.env.EMAIL}>`,
              to: email,
              subject: "Please confirm your Email account",
              html: `<a href="${link}">Verif Your Account</a>`,
            };
            transport.sendMail(mailOptions, function (error, response) {
              if (error) {
                res.end(error);
              } else {
                res
                  .status(201)
                  .send({ msg: "Please, check your Email and verif" });
              }
            });
          })
          .catch((err) => res.status(400).send(err));
      })
      .catch((err) => {
        res.status(500).send(err.details[0].message);
      });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Login System
router.post("/login", async (req, res) => {
  try {
    await for_deller_login
      .validateAsync(req.body)
      .then(async () => {
        const { password, username } = req.body;
        await Dellers.findOne({ username: username })
          .then(async (result) => {
            let checkpassword = await bcrypt.compare(password, result.password);
            if (checkpassword) {
              let token = jwt.sign(
                {
                  _id: result._id,
                  username: result.username,
                  fullname: result.fullname,
                  email: result.email,
                  phone: result.phone,
                },
                process.env.MYTOKENSECRET
              );
              res.send({ token: token });
            }
            res.send({ msg: "Username or Password is incorrect!" });
          })
          .catch((err) =>
            res.send({ msg: "Username or Password is incorrect!" })
          );
      })
      .catch((err) => {
        res.send(err.details[0].message);
      });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/user", token, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.send(error, 500);
  }
});

module.exports = router;
