const { validationResult } = require("express-validator");
const { transformErrorsToMap } = require("../../../utils");

exports.createBanner = async(req, res) => {
    try {
        const errors = validationResult(req);
        const errorMessages = transformErrorsToMap(errors.array());
    
        if (!errors.isEmpty()) {
          return res.status(400).json({ status: false, errors: errorMessages });
        }
    
        const { title, imageType, imageUrl, fixtureId } =
          req.body;
    
        let uploadImageUrl = "";
    
        if (imageType === "image" && req.file) {
          uploadImageUrl = await cloudinaryUpload(req.file, "news");
        }
    
        const news = new News({
          title,
          fixtureId,
          image: imageType === "url" ? imageUrl : uploadImageUrl,
       
        });
    
        const savedBanner = await news.save();
    
        return res.status(201).json({
          status: true,
          message: "Banner created successfully!",
          data: savedBanner
        });
      } catch (error) {
        console.log("error" , error);
        return res.status(500).json({
            status: false,
            message: "Error occuring for Banner created"
          });
      }
}