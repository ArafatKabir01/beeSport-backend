const router = require("express").Router();
const fixtureRoutes = require("./fixture/routes");
const liveMatchRoutes = require("../../routes/web/liveMatchRoutes");
const teamRoutes = require("./team/routes");
const userRoutes = require("./user/routes");
const newsRoutes = require("./news/routes");
const leagueRoutes = require("./league/routes");
const bannerRoutes = require("./banner/routes");
const blockedUserRoutes = require("./blocked-user/routes");
const { getGeneralSetting } = require("../../controllers/web/generalSettingController");

router.use("/auth", userRoutes);
router.use("/news", newsRoutes);
router.use("/teams", teamRoutes);
router.use("/leagues", leagueRoutes);
router.use("/fixtures", fixtureRoutes);
router.use("/live-matches", liveMatchRoutes);
router.use("/teams", teamRoutes);
router.use("/news", newsRoutes);
router.use("/banners", bannerRoutes);
router.use("/general-settings", getGeneralSetting);
router.use("/blocked", blockedUserRoutes);

module.exports = router;
