const express = require("express");
const { getBlackListEntries, getBlackListEntryById, deleteBlackListEntry, updateGuestBlackList } = require("./controller");
const { validateUpdateBlackList } = require("./validation");

const router = express.Router();

router.get("/", getBlackListEntries);

router.get("/find", getBlackListEntryById);

router.put("/update", validateUpdateBlackList, updateGuestBlackList);

router.delete("/delete:id", deleteBlackListEntry);

module.exports = router;
