const {getTopLeagues} = require("./controller");


const router = require("express").Router();


router.get("/", getTopLeagues);


module.exports = router;