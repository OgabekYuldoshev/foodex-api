var express = require("express");
var router = express.Router();
const { User, Dellers, Orders, Foods } = require("../../../../config/db");

const token = require("../../../../middleware/token");
const { setAdmin } = require("../../../../middleware/auth");

// const { upload } = require("../../../middleware/upload");

router.get("/get", token, async (req, res) => {
  try {
    await Dellers.find()
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

router.put("/give_access", token, async (req, res, next) => {
  try {
    const deller = await Dellers.findById(req.query.id);
    deller.access = !deller.access;
    await deller
      .save()
      .then(() => {
        res.status(200).json("Deller Access Updated");
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/delete", token, async (req, res, next) => {
  try {
    await Dellers.findByIdAndDelete(req.query.id);
    await Foods.deleteMany({ dellerID: req.query.id });
    await Orders.deleteMany({ dellerID: req.query.id });
    res.status(200).json("Deller Access Updated");
  } catch (error) {
    console.log(error);
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
