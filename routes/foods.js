const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");
const {
  checkNotAuthenticated,
  checkAuthenticated,
} = require("../middleware/check");
const { Foods, FoodTypes } = require("../config/db");
const slugify = require("slugify");

const queryString = require("query-string");

router.get("/", checkAuthenticated, async (req, res, next) => {
  let foods = await Foods.find();
  res.render("foods", { title: "FOODEX Admin", user: req.user, foods: foods });
});

// router.post("/add_food", checkAuthenticated, upload.any(), async(req, res, next) => {
//   await Foods.create({
//     photo: `uploads/${req.files[0].filename}`,
//     name: req.body.name,
//     type: req.body.type,
//     price: req.body.price
//   }).then(()=>{
//     res.locals.success = "New Food Added"
//     res.status(201)
//     res.redirect('/foods')
//   }).catch(err=>{
//     res.locals.error = err
//     res.status(500)
//     res.redirect('/foods')
//   })
// });

router.post("/add_type", async (req, res, next) => {
  await FoodTypes.create({
    name: req.body.name,
    slug: slugify(req.body.name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: false,
      locale: "vi",
    }),
  })
    .then((data) => {
      res.locals.success = "New Food Added";
      res.send(data).status(201);
      res.redirect("/foods");
    })
    .catch((err) => {
      res.locals.error = err;
      res.status(500);
      res.redirect("/foods");
    });
});

// router.delete("/delete_food", checkAuthenticated, async(req, res, next) => {
//   await Foods.findByIdAndDelete(req.query.id).then(()=>{
//     res.locals.success = "New Food Added"
//     res.status(201)
//     res.redirect('/foods')
//   }).catch(err=>{
//     res.locals.error = err
//     res.status(500)
//     res.redirect('/foods')
//   })
// });

// router.put("/published_food", checkAuthenticated, async(req, res, next) => {
//   let data = queryString.parse(req._parsedUrl.query, {parseBooleans: true});
//   console.log(data.published)
//   await Foods.findByIdAndUpdate(req.query.id, {
//     published: data.published
//   }).then(()=>{
//     res.locals.success = "New Food Added"
//     res.status(201)
//     res.redirect('/foods')
//   }).catch(err=>{
//     res.locals.error = err
//     res.status(500)
//     res.redirect('/foods')
//   })
// });

module.exports = router;
