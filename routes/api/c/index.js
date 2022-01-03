var express = require("express");
const ip = require("ip")
var router = express.Router();
router.use("/order", require("./routes/order"));
router.use("/foods", require("./routes/foods"));

router.get('/connection', (req, res) => {
    res.send(ip.address())
})
module.exports = router;
