const GeneralSettings = require("../../models/GeneralSetting");

const getGeneralSetting = async (req, res, next) => {
  try {
    const generalSetting = await GeneralSettings.find();

    return res.status(200).json({ status: true, message: "General Setting fetched successfully", generalSetting });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

module.exports = {
  getGeneralSetting
};
