
const { validatePassword, generateSignature, exclude, generateSalt, generatePassword, generateVerificationToken } = require("../../../helpers");
const AdminProfile = require("./model");

const EXPIRE_TIME = 60 * 60 * 20 * 1000; // 20 Hours

// Create New Admin
const createAdmin = async (adminInputs) => {
    try {
      const { email, password, name } = adminInputs;
  
      const existingAdmin = await AdminProfile.findOne({ email });
  
      if (existingAdmin) {
        return { status: false, message: "This email already exist!" };
      }
  
      const salt = await generateSalt();
      const hashedPassword = await generatePassword(password, salt);
  
      const newAdmin = new AdminProfile({
        name: name,
        email: email,
        password: hashedPassword,
        salt: salt
      });
  
      await newAdmin.save();
  
      // Generate access token
      const accessToken = await generateVerificationToken({
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role
      });
  
      return {
        status: true,
        message: "Admin created successfully!",
        data: {
          accessToken
        }
      };
    } catch (error) {
      console.error("Error", error);
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
        throw new Error("Email is already exist!");
      }
      throw new Error("Failed to create admin");
    }
  };

const signIn = async (adminInfo) => {
    try {
      const { email, password } = adminInfo;
      const existingAdmin = await AdminProfile.findOne({ email });
  
      if (existingAdmin) {
        const validPassword = await validatePassword(password, existingAdmin.password, existingAdmin.salt);
  
        if (validPassword) {
          const accessToken = await generateSignature(
            {
              email: existingAdmin.email,
              role: existingAdmin.role
            },
            60 * 60 * 24 // 1 Day
          );
  
          const refreshToken = await generateSignature(
            {
              email: existingAdmin.email,
              role: existingAdmin.role
            },
            60 * 60 * 24 * 7 // 7 Days
          );
  
          const admin = exclude(existingAdmin.toObject(), [
            "_id",
            "__v",
            "verify_code",
            "password",
            "salt",
            "forget_code",
            "createdAt",
            "updatedAt"
          ]);
  
          return {
            status: true,
            message: "Admin Login Successfully!",
            data: {
              accessToken,
              refreshToken,
              expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
              ...admin,
              role: "admin"
            }
          };
        } else {
          return {
            status: false,
            message: "Your credentials are incorrect!"
          };
        }
      } else {
        return {
          status: false,
          message: "Your credentials are incorrect!"
        };
      }
    } catch (error) {
      console.error("Error in Sign In:", error);
      throw new Error("Failed to Sign In admin");
    }
  };

  const changePassword = async ({ email, oldPassword, newPassword }) => {
    try {
      const existingAdmin = await AdminProfile.findOne({ email });
  
      if (!existingAdmin) {
        return { status: false, message: "Admin not found" };
      }
  
      const isPasswordValid = await validatePassword(oldPassword, existingAdmin.password, existingAdmin.salt);
  
      if (!isPasswordValid) {
        return { status: false, message: "Invalid old password" };
      }
  
      if (oldPassword === newPassword) {
        return {
          status: false,
          message: "New password cannot be the same as the old password"
        };
      }
  
      const newSalt = await generateSalt();
      const hashedNewPassword = await generatePassword(newPassword, newSalt);
  
      existingAdmin.password = hashedNewPassword;
      existingAdmin.salt = newSalt;
  
      await existingAdmin.save();
  
      return { status: true, message: "Password changed successfully" };
    } catch (error) {
      console.error("Error in Change Password:", error);
      throw new Error("Failed to change password");
    }
  };

  module.exports = {
    signIn,
    createAdmin,
    changePassword
  }