const { getAllLeague, createLeague, updatePointTable, deleteLeague, sortLeague } = require("./controller");
const { validateCreateLeague, validateSingleLeague } = require("./validation");

const router = require("express").Router();


// Get all Leagues
router.get("/", getAllLeague);

// Create a League
router.post("/create", validateCreateLeague, createLeague);

// Update Point Table
router.post("/update/select-point-table", updatePointTable);
// delete League
// router.delete("/:leagueId", deleteLeague);

// Sort Popular League
router.post("/sort", async (req, res, next) => sortLeague);

// Delete League by ID
router.delete("/:id", validateSingleLeague, deleteLeague);

module.exports = router;