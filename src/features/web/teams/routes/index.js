const router = require('express').Router();
const { getAllTeam } = require('../controllers/teamController')

router.get("/", getAllTeam);



module.exports = router;