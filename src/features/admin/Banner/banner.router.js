const { createBanner } = require("./Banner.controller");
const { validateBanner } = require("./banner.validations");

const router = require("express").Router();

router.post("/", validateBanner, createBanner);

router.get("/", (req, res) => {
    res.json({message : "success"})
});

router.put("/:id", (req, res) => {
    res.json({message : "success"})
});

router.delete("/:id", (req, res) => {
    res.json({message : "success"})
});

module.exports = router;