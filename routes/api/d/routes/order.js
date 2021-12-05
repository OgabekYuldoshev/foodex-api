var express = require("express");
var router = express.Router();
const { Orders } = require("../../../../config/db");

const token = require("../../../../middleware/token");

router.get("/", token, async (req, res, next) => {
  console.log(req.user)
  try {
    await Orders.find({dellerID: req.user._id})
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

router.put("/done", token, async (req, res, next) => {
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

router.put("/paid", token, async (req, res, next) => {
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

router.get("/show", token, async (req, res, next) => {
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

module.exports = router;
