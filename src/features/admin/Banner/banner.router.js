const { createBanner, getAllBanners, deleteBanner, updateBanner, getBannerById } = require("./banner.controller");
const multer = require("multer");
const { validateBanner, validateSingleBanner } = require("./banner.validations");

const upload = multer();

const router = require("express").Router();

router.post("/", upload.single("image"), validateBanner, createBanner);

router.get("/", getAllBanners);

router.get("/:bannerId", validateSingleBanner, getBannerById);

router.put("/:bannerId", upload.single("image"), validateBanner, updateBanner);

router.delete("/:bannerId", validateSingleBanner, deleteBanner);

module.exports = router;
