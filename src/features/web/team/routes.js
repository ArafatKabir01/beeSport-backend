const router = require("express").Router();
const { getAllTeam } = require("./controller");

router.get("/", getAllTeam);

module.exports = router;
