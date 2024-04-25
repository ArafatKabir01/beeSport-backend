const { registerController, verifyOTP } = require("./user.controller");
const { userSchemaValidation, otpVerifyValidation } = require("./user.validations");

const router = require("express").Router();


router.post("/signup", userSchemaValidation, registerController)
router.post("/verify-otp", otpVerifyValidation, verifyOTP);

module.exports = router;