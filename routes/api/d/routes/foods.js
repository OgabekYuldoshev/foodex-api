var express = require("express");
var router = express.Router();
const { Dellers, Foods, FoodTypes } = require("../../config/db");
const token = require("../../middleware/token");
const { upload } = require("../../middleware/upload");

const fs = require("fs");

router.get("/", token, async (req, res, next) => {
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

router.get("/types", async (req, res, next) => {
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

module.exports = router;
