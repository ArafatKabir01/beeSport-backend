const { userAuth } = require("../../../middlewares/userAuth");
const { registerController, loginController, verifyOTP, resendOTPController, getUserProfile, forgetPasswordController, updateUserWatchTime } = require("./controller");
const { userSchemaValidation, otpVerifyValidation, loginSchemaValidation, resendOtpValidation, forgetPasswordSchemaValidation } = require("./validations");

const router = require("express").Router();

router.get("/profile", userAuth, getUserProfile);
router.post("/signup", userSchemaValidation, registerController);
router.post("/signin", loginSchemaValidation, loginController);
router.post("/verify-otp", otpVerifyValidation, verifyOTP);
router.post("/resend-otp", resendOtpValidation, resendOTPController);
router.post("/forget-password", forgetPasswordSchemaValidation, forgetPasswordController);

// User Activity Routes
router.put("/watch-time", updateUserWatchTime); // Update User Watch Time


module.exports = router;
