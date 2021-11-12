var express = require("express");
var router = express.Router();
const { Orders, Foods, FoodTypes } = require("../../config/db");
const { client } = require("../../controllers/twillo.js");

let key = async () => {
  return await client.verify.services
    .create({ friendlyName: "Food Export System" })
    .then((service) => {
      return service.sid;
    });
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
          await Orders.create({
            tableID: req.body.table,
            dellerID: req.body.deller,
            numberClient: req.body.number,
            foods: req.body.foods,
            total: req.body.total,
          })
            .then((result) => {
              req.io.sockets.emit("new_order", { msg: "New Order" });
              res.status(201).send(result);
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

router.post("/order_by_card", async (req, res, next) => {
  try {
    await Orders.create({
      tableID: req.body.table,
      dellerID: req.body.deller,
      // numberClient: req.body.number,
      foods: req.body.foods,
      total: req.body.total,
    })
      .then((result) => {
        req.io.sockets.emit("new_order", { msg: "New Order" });
        res.status(201).send(result);
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

// router.get("/send", async (req, res, next) => {
//   try {
//     client.messages.create({
//       body:"Your Verification Code: 56478",
//       to: "+998945360773",
//       from:"+998335360773"
//     }).then((verification) => res.send(verification))
//       .catch((err) => res.send(err));
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

module.exports = router;
