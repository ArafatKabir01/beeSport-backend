const { getAllNews, getGroupByLeague, getSingleNews } = require("./controller");

const router = require("express").Router();

router.get("/group-by-league", getGroupByLeague);
router.get("/", getAllNews);
router.get("/:slug", getSingleNews);

module.exports = router;
