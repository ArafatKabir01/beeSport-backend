const router = require("express").Router();
const fixtureRoutes = require("./fixture/routes");
const teamRoutes = require("./team/routes");
const bannerRoutes = require("./banner/route");
const leagueRoutes = require("./league/routes");
const highlightRoutes = require("./highlight/routes");
const adminAuthRoutes = require("./auth/routes");

router.use("/fixtures", fixtureRoutes);
router.use("/teams", teamRoutes);
router.use("/banners", bannerRoutes);
router.use("/leagues", leagueRoutes);
router.use("/highlights", highlightRoutes);
router.use("/auth", adminAuthRoutes);

module.exports = router;
