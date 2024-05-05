const { validationResult } = require("express-validator");
const multer = require("multer");
const { transformErrorsToMap } = require("../../../utils");
const cloudinaryUpload = require("../../../helpers/cloudinaryUpload");
const Banner = require("./banner.model");

exports.createBanner = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const errorMessages = transformErrorsToMap(errors.array());

    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errorMessages });
    }

    const { title, imageType, imageUrl, fixtureId } = req.body;

    let uploadImageUrl = "";

    if (imageType === "image" && req.file) {
      uploadImageUrl = await cloudinaryUpload(req.file, "news");
    }

    const banner = new Banner({
      title,
      fixtureId,
      image: imageType === "url" ? imageUrl : uploadImageUrl
    });

    const savedBanner = await banner.save();

    return res.status(201).json({
      status: true,
      message: "Banner created successfully!",
      data: savedBanner
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBanner = async (req, res, next) => {
  try {
    const id = req.params.bannerId;
    const errors = validationResult(req);
    const errorMessages = transformErrorsToMap(errors.array());

    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errorMessages });
    }

    const existingBanner = await Banner.findById(id);

    if (!existingBanner) {
      return res.status(404).json({ status: false, message: "Banner not found!" });
    }

    const { title, imageType, imageUrl, fixtureId } = req.body;

    let uploadImageUrl = existingBanner.image;

    if (imageType === "image" && req.file) {
      uploadImageUrl = await cloudinaryUpload(req.file, "banners");
    }

    existingBanner.title = title;

    existingBanner.imageType = imageType;
    existingBanner.image = imageType === "url" ? imageUrl : uploadImageUrl;
    existingBanner.fixtureId = fixtureId;

    await existingBanner.save();

    return res.json({
      status: true,
      message: "Banner updated successfully!",
      data: existingBanner
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllBanners = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      Banner.find({}).limit(limit).skip(skip).sort({ publishDate: "desc" }),
      Banner.countDocuments()
    ]);

    const hasNext = total > skip + limit;
    const hasPrev = page > 1;

    return res.json({
      status: true,
      message: "Banner fetched successfully!",
      data: {
        docs,
        page: +page,
        limit: +limit,
        totalPage: Math.ceil(total / limit),
        totalDocs: total,
        hasNext,
        hasPrev
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getBannerById = async (req, res, next) => {
  try {
    const id = req.params.bannerId;

    const banner = await Banner.findOne({ _id: id });

    if (!banner) {
      return res.status(404).json({ status: false, message: "Banner not found!" });
    }

    return res.status(200).json({
      status: true,
      message: "Banner fetched successfully!",
      data: banner
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBanner = async (req, res, next) => {
  try {
    const id = req.params.bannerId;
    const deletedBanner = await Banner.findByIdAndDelete(id);

    if (!deletedBanner) {
      return res.status(404).json({ status: false, message: "Banner not found!" });
    }

    res.status(200).json({
      status: true,
      message: "Banner deleted successfully!"
    });
  } catch (error) {
    next(error);
  }
};
