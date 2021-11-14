var express = require("express");
var router = express.Router();
const { User, Dellers, Orders } = require("../../../../config/db");
const { for_register, for_login } = require("../../../../middleware/validator");

const token = require("../../../../middleware/token");
const { setAdmin } = require("../../../../middleware/auth");

// const { upload } = require("../../../middleware/upload");

router.get("/get", async (req, res) => {
  try {
    await Dellers.find()
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