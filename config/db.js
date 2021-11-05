const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
});

const DellerSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  access: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const FoodTypesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  created: { type: Date, default: Date.now },
});

const FoodSchema = new Schema({
  photo: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
  type: {
    type: mongoose.Types.ObjectId,
    ref: "types",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  dellerID: {
    type: mongoose.Types.ObjectId,
    ref: "dellers",
    required: true,
  },
  has: {
    type: Boolean,
    default: false,
  },
  created: { type: Date, default: Date.now },
});

const OrderSchema = new Schema({
  tableID: {
    type: Number,
    required: true,
  },
  dellerID: {
    type: mongoose.Types.ObjectId,
    ref: "dellers",
    required: true,
  },
  foods: [
    {
      foodID: {
        type: mongoose.Types.ObjectId,
        ref: "foods",
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  show: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: false,
  },
  payment: {
    type: String,
    default: "onhande",
  },
  paid: {
    type: Boolean,
    default: false,
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const User = mongoose.model("users", UserSchema);
const Foods = mongoose.model("foods", FoodSchema);
const Dellers = mongoose.model("dellers", DellerSchema);
const Orders = mongoose.model("orders", OrderSchema);
const FoodTypes = mongoose.model("types", FoodTypesSchema);

module.exports = { User, Foods, Dellers, Orders, FoodTypes };
