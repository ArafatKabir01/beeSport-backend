const moment = require("moment");
const BlackList = require("./model");
const AdministratorSettings = require("../../admin/administrator-setting/model");
const GeneralSettings = require("../../../models/GeneralSetting");
const { validateUpdateBlackList, validateCreateBlackList, validationResult } = require("./validation");
const { transformErrorsToMap } = require("../../../utils");

const getBlackListEntries = async (req, res, next) => {
  try {
    const blackListEntries = await BlackList.find();
    res.status(200).json(blackListEntries);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getBlackListEntryById = async (req, res, next) => {
  try {
    const result = await validateGetOneBlackList.validateAsync(req.body);

    const blackListEntry = await BlackList.findOne({ ip: result.ip });
    if (!blackListEntry) {
      return res.status(404).json({ error: "BlackList entry not found" });
    }
    res.status(200).json(blackListEntry);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateGuestBlackList = async (req, res, next) => {
  try {
    const publicIP = req.userIp;

    // const result = await validateUpdateBlackList.validateAsync(req.body);

    const errors = validationResult(req);
    const errorMessages = transformErrorsToMap(errors.array());

    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errorMessages });
    }

    const { minutes_watched } = req.body;

    const settings = await GeneralSettings.findOne();

    // Find the user in the BlackList
    let user = await BlackList.findOne({ ip: publicIP });

    // Check if the user exists in the BlackList
    if (!user) {
      // If the user does not exist, create a new guest user
      user = new BlackList({
        ip: publicIP, // Corrected to use the public IP
        role: "guest",
        block_period: 0,
        is_blocked: false,
        status: 0,
        minutes_watched: 0
      });
    }

    // Update minutes_watched with the value from req.body
    user.minutes_watched = minutes_watched;

    // Check if the user is currently blocked
    if (user.is_blocked && user.block_period > 0) {
      // Check if the blocking period has passed (24 hours)
      const currentTime = moment().unix();
      const isAfter = moment(currentTime, "X").isAfter(moment(user.block_period, "X")); // X = unix timestamps

      if (isAfter) {
        // Unblock the user
        user.is_blocked = false;
        user.block_period = 0;
        user.minutes_watched = 0; // Reset minutes_watched for the next cycle

        // Save the updated user in the BlackList
        await user.save();

        return res.json({ status: true, message: "User successfully unblocked.", data: user });
      } else {
        return res.json({ status: true, message: "User is still blocked.", data: user });
      }
    }

    // Check if minutes_watched and are both 5
    if (user.minutes_watched >= settings.GUEST_FREE_WATCH_LIMIT) {
      // Block the user for 24 hours
      user.is_blocked = true;
      user.block_period = moment().add(24, "hours").unix(); // 24 hours in seconds
      user.minutes_watched = 0; // Reset minutes_watched for the next cycle
    }
    // Save the updated user in the BlackList
    await user.save();

    res.json({ status: true, message: "User updated successfully.", data: user });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteBlackListEntry = async (req, res, next) => {
  try {
    const deletedBlackListEntry = await BlackList.findByIdAndDelete(req.params.id);
    if (!deletedBlackListEntry) {
      return res.status(404).json({ status: false, error: "BlackList entry not found" });
    }
    res.status(200).json({ status: true, message: "BlackList entry deleted successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  getBlackListEntries,
  getBlackListEntryById,
  deleteBlackListEntry,
  updateGuestBlackList
};
