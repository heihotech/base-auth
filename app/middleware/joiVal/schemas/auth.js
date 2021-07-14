const Joi = require("joi");

const signUpPOST = Joi.object().keys({
  username: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  roles: Joi.string().required(),
});
const signInPOST = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  signUpPOST,
  signInPOST,
};
