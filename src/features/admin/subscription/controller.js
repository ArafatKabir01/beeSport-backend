const { transformErrorsToMap } = require("../../../utils");
const Subscription = require("./model");
const { validationResult } = require("express-validator");

// Get All Subscription
const getAllSubscription = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find().sort({ position: "asc" });
    res.status(200).json({
      status: true,
      message: subscriptions.length === 0 ? "No subscription found!" : "Subscription fetched successfully!",
      data: subscriptions
    });
  } catch (error) {
    next(error);
  }
};

// Create Subscription
const createSubscription = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: transformErrorsToMap(errors.array()) });
    }

    const subscription = new Subscription(req.body);
    const savedSubscription = await subscription.save();
    res.status(201).json({ status: true, message: "Subscription created successfully!", data: savedSubscription });
  } catch (error) {
    next(error);
  }
};

// Find One Subscription
const findOneSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.subscriptionId);
    if (!subscription) {
      return res.status(404).json({ status: false, message: "Subscription not found!" });
    }
    res.status(200).json({ status: true, message: "Subscription fetched successfully!", data: subscription });
  } catch (error) {
    next(error);
  }
};

// Update One Subscription
const updateOneSubscription = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: transformErrorsToMap(errors.array()) });
    }

    const subscription = await Subscription.findByIdAndUpdate(req.params.subscriptionId, req.body, { new: true });
    if (!subscription) {
      return res.status(404).json({ status: false, message: "Subscription not found!" });
    }
    res.status(200).json({ status: true, message: "Subscription updated successfully!", data: subscription });
  } catch (error) {
    next(error);
  }
};

// Delete One Subscription
const deleteOneSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.subscriptionId);
    if (!subscription) {
      return res.status(404).json({ status: false, message: "Subscription not found!" });
    }
    res.status(200).json({ status: true, message: "Subscription deleted successfully!", data: subscription });
  } catch (error) {
    next(error);
  }
};

// Sort Subscriptions
const sortSubscriptions = async (req, res, next) => {
  try {
    const newItems = req.body;
    await Promise.all(
      newItems.map(async (subscription) => {
        const existingSubscription = await Subscription.findOne({ id: subscription.id });
        if (existingSubscription) {
          existingSubscription.position = subscription.position;
          await existingSubscription.save();
        }
      })
    );
    res.status(200).json({ status: true, message: "Subscription Sorted Successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSubscription,
  createSubscription,
  findOneSubscription,
  updateOneSubscription,
  deleteOneSubscription,
  sortSubscriptions
};
