var express = require("express");
var router = express.Router();
const { Foods, FoodTypes } = require("../../../../config/db");


router.get("/:dellerID", async (req, res, next) => {
  try {
    await Foods.find({
      dellerID: req.params.dellerID,
      has: true,
    })
      .populate("type")
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/:dellerID/:typeID", async (req, res, next) => {
  try {
    let typeObj = await FoodTypes.findOne({ slug: req.params.typeID });
    await Foods.find({
      dellerID: req.params.dellerID,
      type: typeObj._id,
      has: true,
    })
      .populate("type")
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/types", async (req, res, next) => {
  try {
    await FoodTypes.find()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(204).json(err);
      });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
