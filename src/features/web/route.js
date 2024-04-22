const router = require('express').Router();
const fixtureWebRoutes = require("./fixtures/routes");
const liveMatchRoutes = require("../../routes/web/liveMatchRoutes");

router.use('/fixtures', fixtureWebRoutes);
router.use("/live-matches", liveMatchRoutes);


module.exports = router;