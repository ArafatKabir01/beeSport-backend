const { validationResult } = require("express-validator");
const { signIn, createAdmin, changePassword } = require("./services");


exports.adminLoginController = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ status: false, errors: errors.array() });
      }

      const { email, password } = req.body;

      const data = await signIn({ email, password });

      return res.json(data);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  exports.adminRegisterController = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ status: false, errors: errors.array() });
      }

      const { name, email, password } = req.body;
      const adminData = {
        name,
        email,
        password
      };

      const newAdmin = await createAdmin(adminData);

      return res.status(201).json(newAdmin);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  exports.changePasswordController =  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ status: false, errors: errors.array() });
      }

      const { email, oldPassword, newPassword } = req.body;

      // Call the controller function to change the password
      const data = await changePassword({
        email,
        oldPassword,
        newPassword
      });

      return res.json(data);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }