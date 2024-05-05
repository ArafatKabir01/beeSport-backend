const { registerController, loginController, verifyOTP } = require("./controller");
const { userSchemaValidation, otpVerifyValidation, loginSchemaValidation } = require("./validation");

const router = require("express").Router();

router.post("/signup", userSchemaValidation, registerController);
router.post("/signin", loginSchemaValidation, loginController);
router.post("/verify-otp", otpVerifyValidation, verifyOTP);

module.exports = router;
