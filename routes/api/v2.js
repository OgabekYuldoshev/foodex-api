var express = require("express");
var router = express.Router();
const { Orders, Foods } = require("../../config/db");

router.post("/order", async (req, res, next) => {
  try {
    await Orders.create({
      tableID: req.body.table,
      foods: req.body.foods,
      total: req.body.total,
    })
      .then((result) => {
        res.status(201).send(result);
        req.io.sockets.emit("new_order", { msg: "New Order" });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/foods/:type", async (req, res, next) => {
  console.log(req.params.type);
  try {
    await Foods.find({
      type: req.params.type,
      has: true,
    })
      .then((result) => {
        res.status(200).send(result);
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
