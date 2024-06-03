const router = require("express").Router();
const fixtureRoutes = require("./fixture/routes");
const teamRoutes = require("./team/routes");
const bannerRoutes = require("./Banner/route");
const leagueRoutes = require("./league/routes");
const highlightRoutes = require("./highlight/routes");
const adminAuthRoutes = require("./auth/routes");
const administratorSettingsRoute = require("./administrator-setting/routes");

router.use("/fixtures", fixtureRoutes);
router.use("/teams", teamRoutes);
router.use("/banners", bannerRoutes);
router.use("/leagues", leagueRoutes);
router.use("/highlights", highlightRoutes);
router.use("/auth", adminAuthRoutes);
router.use("/administration-settings", administratorSettingsRoute);

module.exports = router;
