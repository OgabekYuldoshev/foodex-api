var express = require("express");
var router = express.Router();
const { Orders } = require("../../../../config/db");
const token = require("../../../../middleware/token");
const { setAdmin } = require("../../../../middleware/auth");

// const { upload } = require("../../../middleware/upload");

router.get("/get", async (req, res) => {
  try {
    await Orders.find()
      .populate("foods.foodID")
      .populate("dellerID")
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

// router.get("/delete", async (req, res) => {
//   try {
//     await Orders.deleteMany()
//       .then((result) => {
//         res.status(200).json(result);
//       })
//       .catch((err) => {
//         res.status(400).json(err);
//       });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

module.exports = router;
