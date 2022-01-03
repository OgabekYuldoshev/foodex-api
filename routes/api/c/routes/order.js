var express = require("express");
var router = express.Router();
const { Orders, Dellers } = require("../../../../config/db");
const { client } = require("../../../../controllers/twillo.js");
const ip = require('ip')
const moment = require("moment");
const today = moment().startOf("day");

let key = async () => {
  return await client.verify.services
    .create({ friendlyName: "Food Export System" })
    .then((service) => {
      return service.sid;
    });
};
const getOrderNum = async () => {
  let result = await Orders.find({
    createdAt: {
      $gte: today.toDate(),
      $lte: moment(today).endOf("day").toDate(),
    },
  });
  return result.length + 1;
};

router.post("/by_phone", async (req, res, next) => {
  try {
    client.verify
      .services(req.query.smsID)
      .verificationChecks.create({
        to: `+${req.body.number}`,
        code: parseFloat(req.query.code),
      })
      .then(async (verification) => {
        if (verification.valid) {
          let number = await getOrderNum();
          await Orders.create({
            clientIP: ip.address(),
            number: number,
            tableID: req.body.table,
            dellerID: req.body.deller,
            payment: req.body.payment,
            numberClient: req.body.number,
            foods: req.body.foods,
            total: req.body.total,
          })
            .then(async (result) => {
              let deller = await Dellers.findById(req.body.deller);
              deller.orders.push(result._id);
              await deller.save((err, done) => {
                if (err) res.status(400).json(err);
                req.io.sockets.emit("new_order", { msg: "New Order" });
                res.status(201).json(result);
              });
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        } else {
          res.status(400).json("Code Is Invalid, please try again");
        }
      })
      .catch((error) => res.json(error));
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/by_card", async (req, res) => {
  try {
    let number = await getOrderNum();
    await Orders.create({
      clientIP: ip.address(),
      number: number,
      tableID: req.body.table,
      payment: req.body.payment,
      dellerID: req.body.deller,
      foods: req.body.foods,
      total: req.body.total,
    })
      .then(async (result) => {
        let deller = await Dellers.findById(req.body.deller);
        deller.orders.push(result._id);
        await deller.save((err, done) => {
          if (err) res.status(400).json(err);
          req.io.sockets.emit("new_order", { msg: "New Order" });
          res.status(201).json(result);
        });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/getCode", async (req, res, next) => {
  try {
    client.verify
      .services(await key())
      .verifications.create({ to: `+${req.body.number}`, channel: "sms" })
      .then((verification) => res.json(verification))
      .catch((err) => res.json(err));
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
