const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/userAuth");

// Admin Routes
router.use("/", require("./admin/adminRoutes"));
router.use("/users", require("./admin/userRoutes"));
router.use(userAuth);
router.use("/news", require("./admin/newsRoutes"));
router.use("/matches", require("./admin/matchRoutes"));
router.use("/notifications", require("./admin/notificationRoutes"));
router.use("/fixtures", require("./admin/fixtureRoutes"));
router.use("/administration-settings", require("./admin/administratorSettingsRoute"));
router.use("/highlights", require("./admin/highlightRoutes"));
router.use("/popular-leagues", require("./admin/popularLeagueRoutes"));
router.use("/banner", require("./admin/bannerRoutes"));
router.use("/tipster", require("./admin/tipSterRoutes"));
router.use("/popular-entities", require("./admin/popularEntitiesRoutes"));
router.use("/news-league", require("./admin/newsLeagueRoutes"));
router.use("/popular/football-leagues", require("./admin/footballLeaguesRoutes"));
router.use("/popular/cricket-leagues", require("./admin/cricketLeaguesRoutes"));
router.use("/subscriptions", require("./admin/subscriptionRoutes"));

module.exports = router;
