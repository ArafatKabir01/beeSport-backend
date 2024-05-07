
const { body, param } = require("express-validator"); 

const validateHighlightBody = [
    body("title").notEmpty().withMessage("Title is required!"),
    body("date").notEmpty().withMessage("Date is required!"),
    body("videoType")
      .isIn(["source", "youtube"])
      .withMessage("Video type either youtube or source!")
      .notEmpty()
      .withMessage("Video type is required!"),
    body("youtubeUrl").if(body("videoType").equals("youtube")).notEmpty().withMessage("Youtube url is required!"),
    body("sources").if(body("videoType").equals("source")).notEmpty().withMessage("Sources is required!"),
    body("thumbnailImageType")
      .isIn(["url", "image"])
      .withMessage("Thumbnail Image Type either image or url!")
      .notEmpty()
      .withMessage("Thumbnail image type is required!"),
    body("thumbnailImageUrl")
      .if(body("thumbnailImageType").equals("url"))
      .notEmpty()
      .withMessage("Thumbnail Image Url is required!")
  ];
  const validateParams = [param("highlightId").notEmpty().withMessage("Highlight ID is required!")];

  module.exports = {
    validateHighlightBody,
    validateParams
  }