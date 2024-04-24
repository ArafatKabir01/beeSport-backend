const router = require('express').Router();
const { getTeamsBySearchTerm , createTeam, getAllTeam, deleteTeamById} = require('../controllers/teamController')

router.delete('/:id', deleteTeamById);
router.get('/search/:searchTerm', getTeamsBySearchTerm);
router.post('/', createTeam);
router.get("/", getAllTeam);



module.exports = router;
