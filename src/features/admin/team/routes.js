const router = require("express").Router();
const { getTeamsBySearchTerm, createTeam, getAllTeam, deleteTeamById, sortTeam } = require("./controller");


router.get("/search/:searchTerm", getTeamsBySearchTerm);
router.post("/sort", sortTeam);
router.delete("/:id", deleteTeamById);
router.post("/", createTeam);
router.get("/", getAllTeam);

module.exports = router;
