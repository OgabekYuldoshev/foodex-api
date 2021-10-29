var express = require("express");
var router = express.Router();
const { Orders } = require("../../config/db");

router.post("/order", async (req, res, next) => {
  try {
    await Orders.create({
      tableID: req.body.table,
      foods: req.body.foods,
    })
      .then((result) => {
        res.status(201).send(result);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
