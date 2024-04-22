const router = require('express').Router();
const fixtureWebRoutes = require("./fixtures/routes");
const liveMatchRoutes = require("../../routes/web/liveMatchRoutes");
const { getTopLeagues } = require('../../controllers/web/leagueController');

router.use('/fixtures', fixtureWebRoutes);
router.use("/live-matches", liveMatchRoutes);
router.use("/leagues", getTopLeagues);


module.exports = router;