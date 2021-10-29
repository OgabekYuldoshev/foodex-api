var express = require("express");
var router = express.Router();
const { get_published_foods } = require("../../controllers/getters");
const { Dellers, Foods, Orders } = require("../../config/db");
const {
  for_deller_register,
  for_deller_login,
} = require("../../middleware/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const token = require("../../middleware/token");

router.get("/foods", token, async (req, res, next) => {
  try {
    await Foods.find({ published: true })
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


router.get("/orders", token, async (req, res, next) => {
  try {
    await Orders.find()
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


router.put("/has_food", token, async (req, res, next) => {
  const { id, has } = req.body;
  try {
    await Foods.findOneAndUpdate({ _id: id }, { has: has })
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

router.post("/register", async (req, res) => {
  try {
    await for_deller_register
      .validateAsync(req.body)
      .then(async () => {
        const { fullname, password, username } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        await Dellers.create({
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
