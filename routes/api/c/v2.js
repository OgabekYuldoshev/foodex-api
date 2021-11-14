var express = require("express");
var router = express.Router();
const { Orders, Foods, FoodTypes, Dellers } = require("../../../config/db");
const { client } = require("../../../controllers/twillo.js");

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
router.post("/order_by_phone", async (req, res, next) => {
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
            number: number,
            tableID: req.body.table,
            dellerID: req.body.deller,
            numberClient: req.body.number,
            foods: req.body.foods,
            total: req.body.total,
          })
            .then(async (result) => {
              let deller = await Dellers.findById(req.body.deller);
              deller.orders.push(result._id);
              await deller.save((err, done) => {
                if (err) res.status(400).send(err);
                req.io.sockets.emit("new_order", { msg: "New Order" });
                res.status(201).send(result);
              });
            })
            .catch((err) => {
              res.status(400).send(err);
            });
        } else {
          res.status(400).send("Code Is Invalid, please try again");
        }
      })
      .catch((error) => res.send(error));
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/order_by_card", async (req, res) => {
  try {
    let number = await getOrderNum();
    await Orders.create({
      number: number,
      tableID: req.body.table,
      dellerID: req.body.deller,
      foods: req.body.foods,
      total: req.body.total,
    })
      .then(async (result) => {
        let deller = await Dellers.findById(req.body.deller);
        deller.orders.push(result._id);
        await deller.save((err, done) => {
          if (err) res.status(400).send(err);
          req.io.sockets.emit("new_order", { msg: "New Order" });
          res.status(201).send(result);
        });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/foods/:dellerID", async (req, res, next) => {
  try {
    await Foods.find({
      dellerID: req.params.dellerID,
      has: true,
    })
      .populate("type")
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

router.get("/foods/:dellerID/:typeID", async (req, res, next) => {
  try {
    let typeObj = await FoodTypes.findOne({ slug: req.params.typeID });
    await Foods.find({
      dellerID: req.params.dellerID,
      type: typeObj._id,
      has: true,
    })
      .populate("type")
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

router.get("/food/types", async (req, res, next) => {
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

router.post("/getCode", async (req, res, next) => {
  try {
    client.verify
      .services(await key())
      .verifications.create({ to: `+${req.body.number}`, channel: "sms" })
      .then((verification) => res.send(verification))
      .catch((err) => res.send(err));
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/send", async (req, res, next) => {
  let n = await getOrderNum();
  console.log(n);
});

module.exports = router;
