const { validationResult } = require("express-validator");
const { transformErrorsToMap } = require("../../../utils");
const { registerService, verifyEmailOtp } = require("./user.service");
const { generateVerificationCode } = require("../../../helpers");



exports.registerController = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        const errorMessages = transformErrorsToMap(errors.array());
  
        if (!errors.isEmpty()) {
          return res.status(400).json({ status: false, errors: errorMessages });
        }
  
        const { name, email, password, confirmPassword } = req.body;
        
        if(password !== confirmPassword){
            return res.status(400).json({ status: false, error : "password and confirm password does't match" });
        }
  
        const newUser = await registerService({name, email, password});

        res.status(200).json(newUser);

      } catch (error) {
        // console.error(error);
        next(error)
      }
}

exports.verifyOTP = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ status: false, errors: errors.array() });
        }
  
        const { otp, email } = req.body;
        const data = await verifyEmailOtp({ email, otp });
  
        return res.json(data);
      } catch (error) {
        console.error(error);
        next(error);
      }
}