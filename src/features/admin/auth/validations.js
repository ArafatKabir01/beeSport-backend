const { body } = require("express-validator");

const adminLoginValidation = [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required")
  ];

const adminRegisterValidation = [
  body("name").notEmpty().withMessage("Name is required!"),
  body("email").isEmail().withMessage("Invalid email format!"),
  body("password").notEmpty().withMessage("Password is required!")
]

const changePasswordValidation = [
  body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
  body("oldPassword").notEmpty().withMessage("Old password is required"),
  body("newPassword").notEmpty().withMessage("New password is required")
]



  module.exports = {
    adminLoginValidation,
    adminRegisterValidation,
    changePasswordValidation
  }