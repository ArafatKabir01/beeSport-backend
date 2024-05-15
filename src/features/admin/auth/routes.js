const { adminLoginController,  adminRegisterController, changePasswordController} = require("./controller");
const { adminLoginValidation, adminRegisterValidation, changePasswordValidation } = require("./validations");

const router = require("express").Router();

router.post("/login", adminLoginValidation, adminLoginController);
router.post("/register", adminRegisterValidation, adminRegisterController);
router.put("/change-password", changePasswordValidation, changePasswordController);


module.exports = router;