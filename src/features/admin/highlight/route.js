const express = require("express");
const multer = require("multer");
const {
  getHighlights,
  createHighlight,
  getHighlightById,
  updateHighlight,
  deleteHighlight
} = require("./controller");
const { validateParams, validateHighlightBody } = require("./validation");

const upload = multer();
const router = express.Router();


router.get("/", getHighlights);
router.get("/:highlightId", validateParams, getHighlightById);
router.post("/create", upload.single("thumbnailImage"), validateHighlightBody, createHighlight);
router.put("/:highlightId", validateParams, upload.single("thumbnailImage"), validateHighlightBody, updateHighlight);
router.delete("/:highlightId", validateParams, deleteHighlight);

module.exports = router;
