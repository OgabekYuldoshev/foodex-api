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

const ConnectionSchema = new Schema({
  IP: {
    type: String,
    required: true,
  },
  connection: {
    type: String,
    required: true,
  },
  generate: {
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
    unique: true,
    lowercase: true,
  },
  foods: [{ type: Schema.Types.ObjectId, ref: "foods" }],
  orders: [{ type: Schema.Types.ObjectId, ref: "orders" }],
  tableQR: [
    {
      name: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
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
  clientIP: {
    type: String,
  },
  number: {
    type: Number,
    required: true,
  },
  tableID: {
    type: Number,
    required: true,
  },
  dellerID: {
    type: mongoose.Types.ObjectId,
    ref: "dellers",
    required: true,
  },
  numberClient: {
    type: Number,
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
const Connection = mongoose.model("connection", ConnectionSchema);


module.exports = { User, Foods, Dellers, Orders, FoodTypes, Connection };
