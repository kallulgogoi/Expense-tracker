const Joi = require("joi");

function signUpValidation(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: "bad request", error: error.details[0].message });
  }
  next();
}

function signInValidation(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(100).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: "bad request", error: error.details[0].message });
  }
  next();
}

module.exports = {
  signInValidation,
  signUpValidation,
};
