var express = require("express");
var router = express.Router();
const { User, Dellers } = require("../../../config/db");
const { for_register, for_login } = require("../../../middleware/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const token = require("../../../middleware/token");
const { setAdmin } = require("../../../middleware/auth");

const { upload } = require("../../../middleware/upload");

const fs = require("fs");

router.use('/dellers', require("./routes/dellers"))

router.post("/register", async (req, res) => {
  try {
    await for_register
      .validateAsync(req.body)
      .then(async () => {
        const { fullname, password, username } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({
          fullname: fullname,
          username: username,
          password: hashPassword,
        })
          .then((result) => {
            res.status(201).send({ msg: "New User Created" });
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

router.post("/login", async (req, res) => {
  try {
    await for_login
      .validateAsync(req.body)
      .then(async () => {
        const { password, username } = req.body;
        await User.findOne({ username: username })
          .then(async (result) => {
            let checkpassword = await bcrypt.compare(password, result.password);
            if (checkpassword) {
              let token = jwt.sign(
                {
                  _id: result._id,
                  username: result.username,
                  fullname: result.fullname,
                },
                process.env.MYTOKENSECRET
              );
              res.status(200).send({ token: token });
            }
            res.send({ msg: "Username or Password is incorrect!" });
          })
          .catch((err) =>
            res.send({ msg: "Username or Password is incorrect!" })
          );
      })
      .catch((err) => {
        res.send(err);
      });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/user", token, setAdmin, async (req, res) => {
  try {
    res.send(req.admin);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
