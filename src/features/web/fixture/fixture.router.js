const { getAllFixtures, getFixtureById } = require("./fixture.controller");

const router = require("express").Router();

router.get("/:id", getFixtureById);
router.get("/", getAllFixtures);


module.exports = router;