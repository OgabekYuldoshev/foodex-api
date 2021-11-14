var express = require("express");
var router = express.Router();
const { Dellers, Foods, Orders, FoodTypes } = require("../../config/db");
const {
  for_deller_register,
  for_deller_login,
} = require("../../middleware/validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const token = require("../../middleware/token");
const { upload } = require("../../middleware/upload");

const fs = require("fs");

router.get("/foods", token, async (req, res, next) => {
  try {
    await Foods.find()
      .populate("type")
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
      .populate("foods.foodID")
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(204).send(err);
      });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/order/done", token, async (req, res, next) => {
  try {
    await Orders.findByIdAndUpdate(req.body.id, { status: req.body.status })
      .populate("foods.foodID")
      .then((data) => {
        res.status(200).send("Order Done!!!");
      })
      .catch((err) => {
        res.status(204).send(err);
      });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/order/paid", token, async (req, res, next) => {
  try {
    await Orders.findByIdAndUpdate(req.body.id, { paid: req.body.paid })
      .populate("foods.foodID")
      .then((data) => {
        res.status(200).send("Order Paid!!!");
      })
      .catch((err) => {
        res.status(204).send(err);
      });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/order/show", token, async (req, res, next) => {
  try {
    await Orders.findByIdAndUpdate(req.query.id, { show: true })
      .then((data) => {
        res.status(200).send("Order SHowed!!!");
      })
      .catch((err) => {
        res.status(204).send(err);
      });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/food/types", async (req, res, next) => {
  try {
    await FoodTypes.find()
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

router.post("/add_food", token, upload.any(), async (req, res, next) => {
  try {
    await Foods.create({
      photo: `uploads/${req.files[0].filename}`,
      dellerID: req.user._id,
      name: req.body.name,
      type: req.body.type,
      price: req.body.price,
    })
      .then(async (result) => {
        let deller = await Dellers.findById(req.user._id);
        deller.foods.push(result._id);
        await deller.save((err, done) => {
          if (err) res.status(400).send(err);
          res.status(201).send("New Food Created!");
        });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/delete_food", token, async (req, res, next) => {
  try {
    await Foods.findByIdAndDelete(req.query.id)
      .then((data) => {
        fs.unlink(data.photo, function (err) {
          if (err) res.status(500).send(err);
          console.log("file deleted successfully");
        });
        res.status(200).send("Food Deleted");
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/update_food", token, upload.any(), async (req, res, next) => {
  try {
    let food = await Foods.findById(req.body.id);
    if (req.files.length != 0) {
      fs.unlink(food.photo, function (err) {
        if (err) return res.status(400).send(err);
        console.log("file deleted successfully");
      });
      food.photo = "uploads/" + req.files[0].filename;
    }
    food.name = req.body.name;
    food.type = req.body.type;
    food.price = req.body.price;
    await food
      .save()
      .then(() => {
        res.status(200).send("Food Updated");
      })
      .catch((err) => {
        res.status(400).send(err);
      });
    // , {
    //   photo: `uploads/${req.files[0].filename}`,
    //   name: req.body.name,
    //   type: req.body.type,
    //   price: req.body.price,
    // }
  } catch (error) {
    console.log(error);
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
