const { check, validationResult } = require('express-validator');

exports.validateCreateBlackList = [
  check('ip')
    .trim()
    .notEmpty().withMessage('IP address cannot be empty')
    .isString().withMessage('IP address is required'),
  
  check('role')
    .isIn(['guest', 'logged-in', 'subscribed']).withMessage('Role must be one of "guest", "logged-in", or "subscribed"')
    .notEmpty().withMessage('Role is required'),

  check('minutes_watched')
    .isInt({ min: 0 }).withMessage('Minutes watched must be an integer and greater than or equal to 0')
    .notEmpty().withMessage('Minutes watched is required'),

  check('block_period')
    .isInt({ min: 1 }).withMessage('Block period must be an integer and greater than or equal to 1')
    .notEmpty().withMessage('Block period is required'),

  check('is_blocked')
    .optional()
    .isBoolean().withMessage('is_blocked must be a boolean'),

  check('status')
    .optional()
    .isBoolean().withMessage('status must be a boolean'),
];

exports.validateUpdateBlackList = [
  check('minutes_watched')
    .isInt({ min: 0 }).withMessage('Minutes watched must be an integer and greater than or equal to 0')
    .notEmpty().withMessage('Minutes watched is required'),
];

exports.validationResult = validationResult;

