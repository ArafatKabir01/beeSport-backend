const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("./user.model");
const error = require('../../../utils/error');
const { generateSalt, generatePassword, generateVerificationCode, generateSignature, exclude, checkTimeValidity, checkOptValidity } = require('../../../helpers');
const sendVerificationEmail = require('../../../services/sendEmailVerification');

const EXPIRE_TIME = 60 * 60 * 24 * 29 * 1000; // 29 Days
const findUsers = () => User.find();

const findUserByProperty = (key, value) => {
    if (key === '_id') {
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

const registerService = async ({
    name,
    email,
    password,
}) => {
    try {
    
        let existingUser = await User.findOne({ email });
    
        if (existingUser) {
          // Case 1: User exists, phone unverified, delete the existing user
          if (existingUser?.email_verified === 0) {
            await User.deleteOne({ email });
            existingUser = null;
          }
    
          // Case 2: User exists, phone verified, and phone provider
          if (existingUser?.email_verified === 1) {
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
            phone: newUser.phone
          },
          60 * 60 * 24 * 30 // 30 Days
        );
    
        const refreshToken = await generateSignature(
          {
            phone: newUser.phone
          },
          60 * 60 * 24 * 60 // 30 Days
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

const loginService = async (email, password) => {
    const user = await findUserByProperty('email', email);
    if (!user) {
        throw error('Invalid credientials', 400);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw error('Invalid credientials', 400);
    }

    const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        accountStatus: user.accountStatus,
    };
    return jwt.sign(payload, 'secret-key', { expiresIn: '2h' });
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
        console.log("verifiedUser", verifiedUser)
  
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

module.exports = {
    findUserByProperty,
    createNewUser,
    findUsers,
    registerService,
    loginService,
    verifyEmailOtp
};