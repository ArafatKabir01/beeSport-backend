const News = require("../../../models/News");


exports.getAllNews = async(req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
    
        const [docs, total] = await Promise.all([
          News.find({}).limit(limit).skip(skip).sort({ publishDate: "desc" }),
          News.countDocuments()
        ]);
    
        const hasNext = total > skip + limit;
        const hasPrev = page > 1;
    
        return res.json({
          status: true,
          message: "News fetched successfully!",
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
}