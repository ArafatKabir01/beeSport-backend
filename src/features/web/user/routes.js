const { userAuth } = require("../../../middlewares/userAuth");
const { registerController, loginController, verifyOTP, resendOTPController, getUserProfile } = require("./controller");
const { userSchemaValidation, otpVerifyValidation, loginSchemaValidation, resendOtpValidation } = require("./validations");

const router = require("express").Router();

router.get("/profile", userAuth, getUserProfile);
router.post("/signup", userSchemaValidation, registerController);
router.post("/signin", loginSchemaValidation, loginController);
router.post("/verify-otp", otpVerifyValidation, verifyOTP);
router.post("/resend-otp", resendOtpValidation, resendOTPController);


module.exports = router;
