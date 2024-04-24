const router = require('express').Router();
const fixtureRoutes = require("./fixtures/routes");
const teamRoutes = require("./teams/routes");

router.use('/fixtures', fixtureRoutes);
router.use('/teams', teamRoutes);


module.exports = router;