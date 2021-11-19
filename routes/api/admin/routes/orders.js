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
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } catch (error) {
    res.status(500).send(error);
  }
});

// router.get("/delete", async (req, res) => {
//   try {
//     await Orders.deleteMany()
//       .then((result) => {
//         res.status(200).send(result);
//       })
//       .catch((err) => {
//         res.status(400).send(err);
//       });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

module.exports = router;
