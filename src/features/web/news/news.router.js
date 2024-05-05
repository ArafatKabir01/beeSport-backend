const { getAllNews } = require("./news.controller");

const router = require("express").Router();

router.get("/", getAllNews);

module.exports = router;
