const express = require("express");
const {
  createStreamAccessValidation,
  updateStreamAccessValidation,
  deleteStreamAccessValidation,
  minutesWatchedValidation
} = require("./validations");
const {
  getStreamAccessEntries,
  createStreamAccessEntry,
  updateStreamAccessEntry,
  deleteStreamAccessEntry,
  updateGuestStreamAccess
} = require("./controller");

const router = express.Router();

router.get("/", getStreamAccessEntries);

router.post("/create", createStreamAccessValidation, createStreamAccessEntry);

router.put("/update", updateStreamAccessValidation, updateStreamAccessEntry);

router.put("/post", minutesWatchedValidation, updateGuestStreamAccess);

router.delete("/delete/:id", deleteStreamAccessValidation, deleteStreamAccessEntry);

module.exports = router;
