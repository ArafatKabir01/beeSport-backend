const router = require('express').Router();
const fixtureWebRoutes = require("./fixture/fixture.router");
const liveMatchRoutes = require("../../routes/web/liveMatchRoutes");
const teamRoutes = require("./team/team.router");
const userRoutes = require("./user/user.router");
const newsRoutes = require("./news/news.router");
const bannerRoutes = require("./banner/banner.router");
const { getTopLeagues } = require('../../controllers/web/leagueController');

router.use("/fixtures", fixtureWebRoutes);
router.use("/live-matches", liveMatchRoutes);
router.use("/leagues", getTopLeagues);
router.use("/teams", teamRoutes);
router.use("/news", newsRoutes);
router.use("/auth", userRoutes);
router.use("/banners", bannerRoutes);


module.exports = router;