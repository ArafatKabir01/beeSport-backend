const { getAllNews } = require("./controller");

const router = require("express").Router();

router.get("/", getAllNews);

module.exports = router;
