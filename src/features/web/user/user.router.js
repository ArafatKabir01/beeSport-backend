const { registerController, loginController, verifyOTP } = require("./user.controller");
const { userSchemaValidation, otpVerifyValidation, loginSchemaValidation } = require("./user.validations");

const router = require("express").Router();

router.post("/signup", userSchemaValidation, registerController);
router.post("/signin", loginSchemaValidation, loginController);
router.post("/verify-otp", otpVerifyValidation, verifyOTP);

module.exports = router;
