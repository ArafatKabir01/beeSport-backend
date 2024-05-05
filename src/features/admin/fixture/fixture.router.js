const {
  getAllFixtures,
  createSelectedFixtures,
  getAllFixturesWithPagination,
  getFixtureById,
  updateFixtureById,
  deleteFixtureById,
  refreshFixtureById,
  getAllOwnFixture
} = require("./fixture.controllers");

const router = require("express").Router();

router.get("/own-fixtures", getAllOwnFixture);
router.get("/byDate", getAllFixtures);
router.get("/:id", getFixtureById);
router.put("/:id", updateFixtureById);
router.patch("/refresh/:id", refreshFixtureById);
router.delete("/:id", deleteFixtureById);
router.get("/", getAllFixturesWithPagination);
router.post("/", createSelectedFixtures);

module.exports = router;
