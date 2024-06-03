const { getAdministratorSettings, updateAdministratorSettings } = require("./controller");

const router = require("express").Router();


router.get("/", getAdministratorSettings);
router.post("/update", updateAdministratorSettings);


module.exports = router;