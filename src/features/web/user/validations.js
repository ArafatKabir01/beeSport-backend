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

const resendOtpValidation = [
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
  body("context")
    .isIn(["verify_code", "forget_code"])
    .withMessage("Context will either verify_code or forget_code!")
    .notEmpty()
    .withMessage("Context is required!")
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

const forgetPasswordSchemaValidation = [
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format")
];

module.exports = {
  userSchemaValidation,
  otpVerifyValidation,
  resendOtpValidation,
  loginSchemaValidation,
  forgetPasswordSchemaValidation
};
