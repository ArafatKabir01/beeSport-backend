const { registerController, loginController, verifyOTP, resendOTPController } = require("./controller");
const { userSchemaValidation, otpVerifyValidation, loginSchemaValidation, resendOtpValidation } = require("./validations");

const router = require("express").Router();

router.post("/signup", userSchemaValidation, registerController);
router.post("/signin", loginSchemaValidation, loginController);
router.post("/verify-otp", otpVerifyValidation, verifyOTP);
router.post("/resend-otp", resendOtpValidation, resendOTPController);


module.exports = router;
