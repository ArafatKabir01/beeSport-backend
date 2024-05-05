const { body } = require("express-validator");

const userSchemaValidation = [
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 6 })
    .withMessage("Password length at least 6 characters!"),
  body("name").trim().notEmpty().withMessage("name is required!")
];

const otpVerifyValidation = [
  body("email").notEmpty().withMessage("Email is required!"),
  body("otp").notEmpty().withMessage("OTP is required!")
];

const loginSchemaValidation = [
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 6 })
    .withMessage("Password length at least 6 characters!")
];

module.exports = {
  userSchemaValidation,
  otpVerifyValidation,
  loginSchemaValidation
};
