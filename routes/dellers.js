const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");
const {
  checkNotAuthenticated,
  checkAuthenticated,
} = require("../middleware/check");
const { Dellers, Foods, FoodTypes } = require("../config/db");
const slugify = require("slugify");

const queryString = require("query-string");

router.get("/", checkAuthenticated, async (req, res, next) => {
  let dellers = await Dellers.find();
  res.render("dellers", {
    title: "FOODEX Admin",
    user: req.user,
    dellers: dellers,
  });
});

router.put("/give_access", checkAuthenticated, async (req, res, next) => {
  const deller = await Dellers.findById(req.query.id);
  deller.access = !deller.access;
  await deller
    .save()
    .then(() => {
      res.locals.success = "Deller Access Updated";
      res.status(201);
      res.redirect("/dellers");
    })
    .catch((err) => {
      res.locals.error = err;
      res.status(500);
      res.redirect("/dellers");
    });
});

// router.delete("/delete_user", checkAuthenticated, async (req, res, next) => {
//   try {
//     await Dellers.findByIdAndDelete(req.query.id);
//     await Foods.deleteMany({ dellerID: req.query.id });
//     res.locals.success = "Deller Deleted";
//     res.status(201);
//     res.redirect("/dellers");
//   } catch (error) {
//     res.locals.error = err;
//     res.status(500);
//     res.redirect("/dellers");
//   }
// });

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

// router.post("/add_type", async (req, res, next) => {
//   await FoodTypes.create({
//     name: req.body.name,
//     slug: slugify(req.body.name, {
//       replacement: "-",
//       remove: undefined,
//       lower: true,
//       strict: false,
//       locale: "vi",
//     }),
//   })
//     .then((data) => {
//       res.locals.success = "New Food Added";
//       res.send(data).status(201);
//       res.redirect("/foods");
//     })
//     .catch((err) => {
//       res.locals.error = err;
//       res.status(500);
//       res.redirect("/foods");
//     });
// });

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
