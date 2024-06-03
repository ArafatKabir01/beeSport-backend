const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./model");
const error = require("../../../utils/error");
const moment = require("moment");
const {
  generateSalt,
  generatePassword,
  generateVerificationCode,
  generateSignature,
  exclude,
  checkTimeValidity,
  checkOptValidity,
  validatePassword
} = require("../../../helpers");
const sendVerificationEmail = require("../../../services/sendEmailVerification");

const EXPIRE_TIME = 60 * 60 * 24 * 29 * 1000; // 29 Days
const findUsers = () => User.find();

const findUserByProperty = (key, value) => {
  if (key === "_id") {
    return User.findById(value);
  }
  return User.findOne({ [key]: value });
};

const createNewUser = ({ name, email, password }) => {
  const user = new User({
    name,
    email,
    password
  });
  return user.save();
};

const registerService = async ({ name, email, password }) => {
  try {
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      // Case 1: User exists, phone unverified, delete the existing user
      if (existingUser?.email_verified === false) {
        await User.deleteOne({ email });
        existingUser = null;
      }

      // Case 2: User exists, phone verified, and phone provider
      if (existingUser?.email_verified === true) {
        return { status: false, message: "This Email already exists!" };
      }

      // Case 3: User exists, phone verified, different provider (prevent manual registration)
      // if (
      //   existingUser?.phone_verified === 1 &&
      //   existingUser?.provider !== "phone" &&
      //   provider === "phone"
      // ) {
      //   return {
      //     status: false,
      //     message: `Please Try, Sign Up with ${capitalizeFirstLetter(
      //       existingUser.provider
      //     )}!`,
      //   };
      // }
    }

    const salt = await generateSalt();
    const hashedPassword = await generatePassword(password, salt);

    let newUser = existingUser;

    if (!newUser) {
      // Create a new user if not exists
      newUser = new User({
        email,
        password: hashedPassword,
        salt,
        name
      });

      await newUser.save();
    }

    // Case 4: User is registered with email provider
    const otp = generateVerificationCode(6);
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Save verify code
    await newUser.updateOne({ verify_code: hashedOtp });

    // Send Eamil
    await sendVerificationEmail(email, otp);

    ///////////===== Other Login Providers Not Handled Right Now  =====///////////

    // Case 5: User registered via social provider
    const accessToken = await generateSignature(
      {
        email: newUser.email
      },
      60 * 60 * 24 * 30 // 2 minutes
    );

    const refreshToken = await generateSignature(
      {
        email: newUser.email
      },
      60 * 60 * 24 * 30 // 2 minutes
    );

    const user = exclude(newUser.toObject(), [
      "_id",
      "__v",
      "password",
      "salt",
      "verify_code",
      "provider",
      "forget_code",
      "createdAt",
      "updatedAt",
      "favorites"
    ]);

    return {
      status: true,
      message: "Login successfully!",
      data: {
        accessToken,
        refreshToken,
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
        ...user,
        role: "user"
      }
    };
  } catch (error) {
    console.error("Error", error);
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      throw new Error("Email is already exist!");
    }
    throw new Error("Failed to create user!");
  }
};

const loginService = async ({ email, password }) => {
  try {
    let existingUser = await User.findOne({ email });

    if (!existingUser) {
      return {
        status: false,
        message: "Your credentials are incorrect!"
      };
    } else {
      const validPassword = await validatePassword(password, existingUser.password, existingUser.salt);

      if (validPassword) {
        const accessToken = await generateSignature(
          {
            email: existingUser.email
          },
          60 * 60 * 24 * 30 // 30 Days
        );

        const refreshToken = await generateSignature(
          {
            email: existingUser.email
          },
          60 * 60 * 24 * 60 // 60 Days
        );

        const user = exclude(existingUser.toObject(), [
          "_id",
          "__v",
          "password",
          "salt",
          "verify_code",
          "provider",
          "forget_code",
          "createdAt",
          "updatedAt"
        ]);

        return {
          status: true,
          message: "Login successfully!",
          data: {
            accessToken,
            refreshToken,
            expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
            ...user,
            role: "user"
          }
        };
      } else {
        return {
          status: false,
          message: "Your credentials are incorrect!"
        };
      }
    }
  } catch (error) {
    console.error("Error in Sign In:", error);
    throw new Error("Failed to user Sign In!");
  }
};

const verifyEmailOtp = async (optInfo) => {
  try {
    const { email, otp } = optInfo;
    const findUser = await User.findOne({ email });

    if (!findUser) {
      return { status: false, message: "OTP is expired or incorrect!" };
    }

    const hashedOtp = findUser.verify_code;
    let isValidOtp = false;
    const isValidTime = checkTimeValidity(findUser.updatedAt);

    if (!!hashedOtp) {
      isValidOtp = await checkOptValidity(otp, hashedOtp);
    }

    if (isValidOtp && isValidTime) {
      const userData = {
        email_verified: 1,
        status: 1,
        verify_code: null
      };

      const verifiedUser = await User.findByIdAndUpdate(findUser._id, userData, { new: true });

      const accessToken = await generateSignature(
        {
          phone: verifiedUser.phone
        },
        60 * 60 * 24 * 30 // 30 Days
      );

      const refreshToken = await generateSignature(
        {
          phone: verifiedUser.phone
        },
        60 * 60 * 24 * 60 // 60 Days
      );

      const user = exclude(verifiedUser.toObject(), [
        "password",
        "salt",
        "verify_code",
        "provider",
        "forget_code",
        "createdAt",
        "updatedAt",
        "_id",
        "__v"
      ]);

      return {
        status: true,
        data: {
          ...user,
          accessToken,
          refreshToken,
          expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
          role: "user"
        },
        message: "Otp validated & sign in successfully!"
      };
    } else {
      return { status: false, message: "OTP is expired or incorrect!" };
    }
  } catch (error) {
    console.error("Error", error);
    throw new Error("Failed");
  }
};


const resendOTP = async (userInfo) => {
  try {
    const { email, context } = userInfo;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return { status: false, message: "User not found!" };
    }

    if (existingUser.email_verified !== false && context === "verify_code") {
      return { status: false, message: "Email is already verified!" };
    }

    const otp = generateVerificationCode(6);
    const hashedOtp = await bcrypt.hash(otp, 10);

    // 2 minutes block time for each request
    if (!existingUser.resend_otp_block_timestamp) {
      const time = moment().add(2, "minutes").unix();

      if (context === "verify_code") {
        await existingUser.updateOne({
          verify_code: hashedOtp,
          resend_otp_block_timestamp: time
        });
      } else {
        await existingUser.updateOne({
          forget_code: hashedOtp,
          resend_otp_block_timestamp: time
        });
      }
    } else {
      const currentTime = moment().unix();
      const isBlocked = moment(currentTime).isBefore(existingUser.resend_otp_block_timestamp);

      if (isBlocked) {
        return {
          status: false,
          message: "Try again after waiting for up to 2 minutes!"
        };
      } else {
        const time = moment().add(2, "minutes").unix();

        if (context === "verify_code") {
          await existingUser.updateOne({
            verify_code: hashedOtp,
            resend_otp_block_timestamp: time
          });
        } else {
          await existingUser.updateOne({
            forget_code: hashedOtp,
            resend_otp_block_timestamp: time
          });
        }
      }
    }

    // Send OTP for email
    await sendVerificationEmail(email, otp);

    return {
      status: true,
      message: "New OTP sent successfully!"
    };

   

    // // Send OTP
    // const otpResponse = await sendOTPVerification(email, otp);

    // if (otpResponse === "0") {
    //   return {
    //     status: true,
    //     message: "New OTP sent successfully!"
    //   };
    // } else if (otpResponse === "6") {
    //   return {
    //     status: false,
    //     message: "Your are provided wrong email!"
    //   };
    // } else {
    //   return {
    //     status: false,
    //     message: "Something went wrong!"
    //   };
    // }
  } catch (error) {
    console.error("Error in Resend Verification Email:", error);
    throw new Error("Failed to resend verification email");
  }
};


// Forget Password
const forgetPassword = async ({ email }) => {
  try {
    const existingUser = await User.findOne({ email, email_verified: true});

    if (!existingUser) {
      return {
        status: false,
        message: "Please, provide us your verified email!"
      };
    }

    const otp = generateVerificationCode(6);
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Save Forget Code
    await existingUser.updateOne({ forget_code: hashedOtp });

    // Send OTP for email
    await sendVerificationEmail(email, otp);

    return {
      status: true,
      message: "OTP sent successfully!"
    };

  } catch (error) {
    console.error("Error in forget Password:", error);
    throw new Error("Failed to forget password!");
  }
};

// Get User Profile
const getProfile = async (userInfo) => {
  try {
    const { email } = userInfo;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new Error("No profile exists!");
    }

    const userWithoutSensitiveInfo = exclude(existingUser.toObject(), [
      "_id",
      "__v",
      "password",
      "salt",
      "verify_code",
      "forget_code",
      "createdAt",
      "updatedAt"
    ]);

    userWithoutSensitiveInfo.role = "user";

    return {
      status: true,
      message: "User profile found!",
      data: userWithoutSensitiveInfo
    };
  } catch (error) {
    console.error(error);
    if (error.message === "No Profile") {
      throw new Error("User profile does not exist");
    } else {
      throw new Error("Failed to retrieve user profile");
    }
  }
};

module.exports = {
  findUserByProperty,
  createNewUser,
  findUsers,
  registerService,
  loginService,
  verifyEmailOtp,
  resendOTP,
  getProfile,
  forgetPassword
};
