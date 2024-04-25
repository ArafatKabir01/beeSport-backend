const { body, param } = require("express-validator");

const validateBanner= [
    body("title").notEmpty().withMessage("Title is required!"),
    body("imageType")
      .isIn(["url", "image"])
      .withMessage("Image Type either image or url!")
      .notEmpty()
      .withMessage("Image Type is required!"),
    body("imageUrl").if(body("imageType").equals("url")).notEmpty().withMessage("Image Url is required!"),
    body("fixtureId").notEmpty().withMessage("Fixture Id is required!"),
   
  ];
const validateSingleBanner = [param("bannerId").notEmpty().withMessage("Banner Id is required!")];

module.exports = {
    validateBanner,
    validateSingleBanner
}

  