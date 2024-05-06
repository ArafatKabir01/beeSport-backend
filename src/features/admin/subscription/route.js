const { body, param } = require("express-validator");
const express = require("express");
const router = express.Router();

const {
  getAllSubscription,
  createSubscription,
  findOneSubscription,
  updateOneSubscription,
  deleteOneSubscription,
  sortSubscriptions
} = require("./controller");

// validation
const validateCreateSubscription = [
  body("title").notEmpty().withMessage("Title is required!"),
  body("duration_type").notEmpty().withMessage("Duration type is required!"),
  body("duration").notEmpty().withMessage("Duration is required!"),
  body("price").isArray().withMessage("Price must be an array!"),
  body("status").notEmpty().withMessage("Status is required!"),
  body("descriptions").isArray().notEmpty().withMessage("Descriptions are required!")
];

const validateSingleSubscription = [param("subscriptionId").notEmpty().withMessage("Subscription ID is required!")];

// Get All Subscriptions
router.get("/", getAllSubscription);

// Create A Subscription
router.post("/create", validateCreateSubscription, createSubscription);

// Find Subscription by ID
router.get("/:subscriptionId", validateSingleSubscription, findOneSubscription);

// Update Subscription by Id
router.put("/:subscriptionId", validateCreateSubscription, updateOneSubscription);

// Delete a Subscription by Id
router.delete("/:subscriptionId", validateSingleSubscription, deleteOneSubscription);

// Sort subscription
router.post("/sort", sortSubscriptions);

module.exports = router;
