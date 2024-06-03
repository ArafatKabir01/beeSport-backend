const { validationResult } = require("express-validator");
const moment = require("moment");
const { transformErrorsToMap } = require("../../../utils");
const AdministratorSettings = require("../../admin/administrator-setting/model");
const GeneralSettings = require("../../../models/GeneralSetting");
const { registerService, loginService, verifyEmailOtp, resendOTP, getProfile, forgetPassword } = require("./service");
const { generateVerificationCode } = require("../../../helpers");
const User = require("./model");

exports.registerController = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const errorMessages = transformErrorsToMap(errors.array());

    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errorMessages });
    }

    const { name, email, password} = req.body;
    const newUser = await registerService({ name, email, password });
    res.status(200).json(newUser);

  } catch (error) {

    console.error(error);
    next(error);
    
  }
};

exports.loginController = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const errorMessages = transformErrorsToMap(errors.array());

    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errorMessages });
    }

    const { email, password } = req.body;


    const newUser = await loginService({ email, password });

    res.status(200).json(newUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.verifyOTP = async (req, res, next) => {
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
};

exports.resendOTPController = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const errorMessages = transformErrorsToMap(errors.array());

    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errorMessages });
    }

    const { email, context } = req.body;

    const data = await resendOTP({ email, context });

    return res.json(data);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

exports.getUserProfile = async (req, res, next) => {
  try {
    const { email } = req.user;
    const data = await getProfile({ email });
    return res.json(data);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

exports.forgetPasswordController = async (req, res, next) => {

  try{
    const errors = validationResult(req);
    const errorMessages = transformErrorsToMap(errors);

    if(!errors.isEmpty()){
      res.status(400).json({status : false, errors : errorMessages});
    }

    const {email} = req.body;

    const data = await forgetPassword({email});

    res.status(data);

  }catch(err){
    console.error(err);
    next(err);
  }

}


exports.updateUserWatchTime =  async (req, res, next) => {
  try {
    const { email, minutes_watched } = req.body;

    // Find the user in the BlackList
    const existingUser = await User.findOne({ email });
    const settings = await GeneralSettings.findOne();
    if (!existingUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Increase minutes_watched with every hit
    existingUser.minutes_watched = minutes_watched;

    // Check if the user is currently blocked
    if (existingUser.is_blocked && existingUser.block_period > 0) {
      // Check if the blocking period has passed (24 hours)
      const currentTime = moment().unix();
      const isAfter = moment(currentTime, "X").isAfter(moment(existingUser.block_period, "X"));

      if (isAfter) {
        // Unblock the user
        existingUser.is_blocked = false;
        existingUser.block_period = 0;
        existingUser.minutes_watched = 0; // Reset minutes_watched for the next cycle

        // Save the updated user in the BlackList
        await existingUser.save();

        return res.status(200).json({ message: "User successfully unblocked.", data: existingUser });
      } else {
        return res.status(200).json({ message: "User is still blocked.", data: existingUser });
      }
    }

    // Check if minutes_watched and pop_up_opened are both 5
    if (existingUser.minutes_watched >= settings.Login_FREE_WATCH_LIMIT) {
      // Block the user for 24 hours
      existingUser.is_blocked = true;
      existingUser.block_period = moment().add(24, "hours").unix(); // 24 hours in seconds
      existingUser.minutes_watched = 0; // Reset minutes_watched for the next cycle
    }

    // Save the updated user in the BlackList
    await existingUser.save();

    res.status(200).json({ message: "User updated successfully.", data: existingUser });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
