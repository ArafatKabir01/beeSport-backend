const router = require("express").Router();
const fixtureRoutes = require("./fixture/route");
const liveMatchRoutes = require("../../routes/web/liveMatchRoutes");
const teamRoutes = require("./team/route");
const userRoutes = require("./user/route");
const newsRoutes = require("./news/route");
const leagueRoutes = require("./league/route");
const bannerRoutes = require("./banner/route");
const { getTopLeagues } = require('../../controllers/web/leagueController');

router.use("/auth", userRoutes);
router.use("/news", newsRoutes);
router.use("/teams", teamRoutes);
router.use("/leagues", leagueRoutes);
router.use("/fixtures", fixtureRoutes);
router.use("/live-matches", liveMatchRoutes);
router.use("/teams", teamRoutes);
router.use("/news", newsRoutes);
router.use("/auth", userRoutes);
router.use("/banners", bannerRoutes);

module.exports = router;
