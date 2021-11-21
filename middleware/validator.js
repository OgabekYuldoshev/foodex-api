const Joi = require("joi");

const for_login = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(6)
    .required(),
});

const for_register = Joi.object({
  fullname: Joi.string().min(3).max(30).required(),
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(6)
    .required(),
  regkey: Joi.string().min(6).required(),
});

const for_deller_register = Joi.object({
  fullname: Joi.string().min(3).max(30).required(),
  username: Joi.string().min(3).max(30).lowercase().required(),
  address: Joi.string().min(3).required(),
  email: Joi.string().email().min(3).max(30).lowercase().required(),
  number: Joi.string()
    .length(12)
    .pattern(/^[0-9]+$/)
    .required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(6)
    .required(),
});

const for_deller_login = Joi.object({
  username: Joi.string().min(3).max(30).lowercase().required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(6)
    .required(),
});
module.exports = {
  for_register,
  for_login,
  for_deller_register,
  for_deller_login,
};
