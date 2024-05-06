// validationMiddleware.js
const { body } = require("express-validator");

const validatePayment = [
  body("payment_id").isString().withMessage("Payment ID must be a string"),
  body("amount").isNumeric().withMessage("Amount must be a number"),
  body("currency").isString().withMessage("Currency must be a string"),
  body("user_email").isEmail().withMessage("User email must be a valid email"),
  body("subscription_type").isString().withMessage("Subscription type must be a string"),
  body("subscription_duration").isString().withMessage("Subscription duration must be a string"),
  body("payment_method").isIn(["credit_card", "paypal", "bank_transfer"]).withMessage("Invalid payment method")
];

module.exports = validatePayment;
