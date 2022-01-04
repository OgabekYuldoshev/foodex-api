var express = require("express");
var router = express.Router();
const path = require('path')
const { Orders } = require("../../../config/db");
const pdfGenerator = require('../../../generator/order/pdf')
router.get("/order/pdf/:id", async (req, res) => {
    try {
        const order = await Orders.findById(req.params.id).populate("foods.foodID")
        const dir = 'pdf' + path.sep;
        const filePath = dir + order?._id + '.pdf';
        const file = await pdfGenerator({
            dir,
            filePath: filePath,
            content: { order }
        });
        res.download(path.resolve(file))
    } catch (error) {
        console.log(error)
    }
});
module.exports = router;