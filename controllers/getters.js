const { Foods } = require("../config/db");

async function get_foods() {
  let data = await Foods.find()
  return data
};

async function get_published_foods() {
    let data = await Foods.find({published: true})
    return data
};

module.exports = { get_foods, get_published_foods };
