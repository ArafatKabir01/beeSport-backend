const { getAllBanners } = require("./controller");

const router = require("express").Router();


router.get("/", getAllBanners);


module.exports = router;