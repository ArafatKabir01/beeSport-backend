const { body, param } = require("express-validator");

const validateCreateLeague = [
  body("name").notEmpty().withMessage("Name is required"),
  body("id").notEmpty().withMessage("League ID is required")
];

const validateSingleLeague = [param("id").notEmpty().withMessage("League ID is required")];

module.exports = {
  validateCreateLeague,
  validateSingleLeague
};
