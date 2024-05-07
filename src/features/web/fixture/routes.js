const { getAllFixtures, getFixtureById } = require("./controller");

const router = require("express").Router();

router.get("/:id", getFixtureById);
router.get("/", getAllFixtures);

module.exports = router;
