const router = require("express").Router();
const fixtureRoutes = require("./fixture/fixture.router");
const teamRoutes = require("./team/team.router");
const bannerRoutes = require("./Banner/banner.router");

router.use("/fixtures", fixtureRoutes);
router.use("/teams", teamRoutes);
router.use("/banners", bannerRoutes);

module.exports = router;
