const router = require("express").Router();
const fixtureRoutes = require("./fixture/route");
const teamRoutes = require("./team/route");
const bannerRoutes = require("./Banner/route");
const leagueRoutes = require("./league/route");

router.use("/fixtures", fixtureRoutes);
router.use("/teams", teamRoutes);
router.use("/banners", bannerRoutes);
router.use("/leagues", leagueRoutes);

module.exports = router;
