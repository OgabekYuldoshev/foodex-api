const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");
const {
  checkNotAuthenticated,
  checkAuthenticated,
} = require("../middleware/check");
const { Orders } = require("../config/db");

const queryString = require("query-string");
var moment = require("moment");

router.get("/", checkAuthenticated, async (req, res, next) => {
  let orders = await Orders.find().populate('foods.foodID').populate('dellerID')
  res.render("orders", {
    title: "FOODEX Orders",
    user: req.user,
    orders: orders,
    moment: moment,
  });
});


router.delete("/delete_order", checkAuthenticated, async(req, res, next) => {
  await Orders.findByIdAndDelete(req.query.id).then(()=>{
    res.locals.success = "New Deleted"
    res.status(201)
    res.redirect('/orders')
  }).catch(err=>{
    res.locals.error = err
    res.status(500)
    res.redirect('/orders')
  })
});


module.exports = router;
