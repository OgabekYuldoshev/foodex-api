const { Dellers, User } = require("../config/db");
const jwt = require("jsonwebtoken");

async function setUser(req, res, next) {
  if (req.headers.authorization) {
    await Dellers.findOne(
      { _id: jwt.decode(req.headers.authorization.split(" ")[1])._id },
      "_id username fullname created updated"
    )
      .then((result) => {
        req.user = result;
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  }
  next();
}

async function setAdmin(req, res, next) {
  if (req.headers.authorization) {
    await User.findOne(
      { _id: jwt.decode(req.headers.authorization.split(" ")[1])._id },
      "_id username fullname created updated"
    )
      .then((result) => {
        req.admin = result;
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  }
  next();
}

module.exports = { setUser, setAdmin };
