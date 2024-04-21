const { getAllFixtures, getFixtureById } = require("../controllers/fixture-controllers");

const router = require("express").Router();

router.get("/:id", getFixtureById);
router.get("/", getAllFixtures);


module.exports = router;