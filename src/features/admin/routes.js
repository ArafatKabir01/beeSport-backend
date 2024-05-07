const router = require("express").Router();
const fixtureRoutes = require("./fixture/routes");
const teamRoutes = require("./team/routes");
const bannerRoutes = require("./banner/route");
const leagueRoutes = require("./league/routes");
const highlightRoutes = require("./highlight/routes");

router.use("/fixtures", fixtureRoutes);
router.use("/teams", teamRoutes);
router.use("/banners", bannerRoutes);
router.use("/leagues", leagueRoutes);
router.use("/highlights", highlightRoutes);

module.exports = router;
