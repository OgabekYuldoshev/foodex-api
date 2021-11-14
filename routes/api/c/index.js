var express = require("express");
var router = express.Router();
router.use("/order", require("./routes/order"));
router.use("/foods", require("./routes/foods"));
module.exports = router;
