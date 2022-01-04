var express = require("express");
var router = express.Router();
const path = require('path')
const { Orders } = require("../../../config/db");
const pdfGenerator = require('../../../generator/order/pdf')
const pngGenerator = require('../../../generator/order/image')
router.get("/order/:type/:id", async (req, res) => {
    try {
        const order = await Orders.findById(req.params.id).populate("foods.foodID")
        const dir = 'pdf' + path.sep;
        if (req.params.type === 'pdf') {
            const filePath = dir + order?._id + '.pdf';
            const file = await pdfGenerator({
                dir,
                filePath: filePath,
                content: { order }
            });
            res.download(path.resolve(file))
        } else if (req.params.type === 'png') {
            const filePath = dir + order?._id + '.png';
            const file = await pngGenerator({
                dir,
                filePath: filePath,
                content: { order }
            });
            res.download(path.resolve(file))
        } else {
            res.send("Type error")
        }
    } catch (error) {
        console.log(error)
    }
});
module.exports = router;