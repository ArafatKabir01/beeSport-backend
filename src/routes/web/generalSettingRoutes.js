const express = require("express");
const { getGeneralSetting } = require("../../controllers/web/generalSettingController");
const router = express.Router();

router.get("/", getGeneralSetting);

module.exports = router;
