const moment = require("moment");
const StreamAccess = require("./model");

const getStreamAccessEntries = async (req, res, next) => {
  try {
    const streamAccessEntries = await StreamAccess.find();
    res.status(200).json(streamAccessEntries);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getStreamAccessEntryById = async (req, res, next) => {
  try {
    const streamAccessEntry = await StreamAccess.findOne({ ip: req.body.ip });
    if (!streamAccessEntry) {
      return res.status(404).json({ error: "StreamAccess entry not found" });
    }
    res.status(200).json(streamAccessEntry);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const createStreamAccessEntry = async (req, res, next) => {
  try {
    const streamAccessEntry = new StreamAccess(req.body);
    await streamAccessEntry.save();
    res.status(201).json(streamAccessEntry);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateStreamAccessEntry = async (req, res, next) => {
  try {
    const publicIP =
      req.headers["cf-connecting-ip"] ||
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "";

    // Find the user in the StreamAccess
    let user = await StreamAccess.findOne({ ip: publicIP });

    // Check if the user exists in the StreamAccess
    if (!user) {
      // If the user does not exist, create a new guest user
      user = new StreamAccess({
        ip: publicIP, // Corrected to use the public IP
        role: "guest",
        blockPeriod: 0,
        isBlocked: false,
        popUpOpenedCount: 0,
        status: 0,
        minutesWatched: 0
      });
    }

    // Increase minutesWatched with every hit
    user.minutesWatched += 1;
    user.popUpOpenedCount += 1;

    // Check if the user is currently blocked
    if (user.isBlocked && user.blockPeriod > 0) {
      // Check if the blocking period has passed (24 hours)
      const currentTime = moment().unix();
      const isAfter = moment(currentTime, "X").isAfter(moment(user.blockPeriod, "X")); // X = unix timestamps

      if (isAfter) {
        // Unblock the user
        user.isBlocked = false;
        user.blockPeriod = 0;
        user.minutesWatched = 0; // Reset minutesWatched for the next cycle
        user.popUpOpenedCount = 0; // Reset popUpOpenedCount for the next cycle

        // Save the updated user in the StreamAccess
        await user.save();

        return res.json({ message: "User successfully unblocked.", user });
      } else {
        return res.json({ message: "User is still blocked.", user });
      }
    }

    // Check if minutesWatched and popUpOpenedCount are both 5
    if (user.minutesWatched === 5 && user.popUpOpenedCount === 5) {
      // Block the user for 24 hours
      user.isBlocked = true;
      user.blockPeriod = moment().add(24, "hours").unix(); // 24 hours in seconds
      user.minutesWatched = 0; // Reset minutesWatched for the next cycle
      user.popUpOpenedCount = 0; // Reset popUpOpenedCount for the next cycle
    }

    // Save the updated user in the StreamAccess
    await user.save();

    res.json({ message: "User updated successfully.", user });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateGuestStreamAccess = async (req, res, next) => {
  try {
    const publicIP =
      req.headers["cf-connecting-ip"] ||
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "";

    const { minutes } = req.body;

    // Find the user in the StreamAccess
    let user = await StreamAccess.findOne({ ip: publicIP });

    // Check if the user exists in the StreamAccess
    if (!user) {
      // If the user does not exist, create a new guest user
      user = new StreamAccess({
        ip: publicIP, // Corrected to use the public IP
        role: "guest",
        blockPeriod: 0,
        isBlocked: false,
        popUpOpenedCount: 0,
        status: 0,
        minutesWatched: 0
      });
    }

    // Update minutesWatched with the value from req.body
    user.minutesWatched += parseInt(minutes, 10);

    // Check if the user is currently blocked
    if (user.isBlocked && user.blockPeriod > 0) {
      // Check if the blocking period has passed (24 hours)
      const currentTime = moment().unix();
      const isAfter = moment(currentTime, "X").isAfter(moment(user.blockPeriod, "X")); // X = unix timestamps

      if (isAfter) {
        // Unblock the user
        user.isBlocked = false;
        user.blockPeriod = 0;
        user.minutesWatched = 0; // Reset minutesWatched for the next cycle

        // Save the updated user in the StreamAccess
        await user.save();

        return res.json({ message: "User successfully unblocked.", user });
      } else {
        return res.json({ message: "User is still blocked.", user });
      }
    }

    // Check if minutesWatched and popUpOpenedCount are both 5
    if (user.minutesWatched >= 300) {
      // Block the user for 24 hours
      user.isBlocked = true;
      user.blockPeriod = moment().add(24, "hours").unix(); // 24 hours in seconds
      user.minutesWatched = 0; // Reset minutesWatched for the next cycle
    }
    // Save the updated user in the StreamAccess
    await user.save();

    res.json({ message: "User updated successfully.", user });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteStreamAccessEntry = async (req, res, next) => {
  try {
    const deletedStreamAccessEntry = await StreamAccess.findByIdAndDelete(req.params.id);
    if (!deletedStreamAccessEntry) {
      return res.status(404).json({ error: "StreamAccess entry not found" });
    }
    res.status(200).json({ message: "StreamAccess entry deleted successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  getStreamAccessEntries,
  getStreamAccessEntryById,
  createStreamAccessEntry,
  updateStreamAccessEntry,
  deleteStreamAccessEntry,
  updateGuestStreamAccess
};
