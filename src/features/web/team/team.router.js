const router = require('express').Router();
const { getAllTeam } = require('./team.controller')

router.get("/", getAllTeam);



module.exports = router;