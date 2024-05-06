// validations.js
const { body } = require("express-validator");

// Validation middleware for creating a new BlackList entry
const ipValidation = body("ip").isString().trim().notEmpty().withMessage("IP must be a string");
const roleValidation = body("role")
  .isString()
  .trim()
  .notEmpty()
  .isIn(["guest", "logged-in", "subscribed"])
  .withMessage("Invalid role");
const minutesWatchedValidation = body("minutesWatched").isNumeric().withMessage("Minutes watched must be a number");
const isBlockedValidation = body("blockPeriod").isNumeric().withMessage("Block period must be a number");
const popUpOpenedValidation = body("pop_up_opened").isNumeric();
const statusValidation = body("status").isNumeric();

const createStreamAccessValidation = [
  ipValidation,
  roleValidation,
  minutesWatchedValidation,
  isBlockedValidation,
  popUpOpenedValidation,
  statusValidation
];

const updateStreamAccessValidation = [
  ipValidation,
  roleValidation,
  minutesWatchedValidation,
  isBlockedValidation,
  popUpOpenedValidation,
  statusValidation
];

const deleteStreamAccessValidation = [ipValidation];

module.exports = {
  createStreamAccessValidation,
  updateStreamAccessValidation,
  deleteStreamAccessValidation,
  minutesWatchedValidation
};
