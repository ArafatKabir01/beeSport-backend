const { validationResult } = require("express-validator");
const News = require("../../../models/News");
const { transformErrorsToMap } = require("../../../utils");

exports.getAllNews = async (req, res, next) => {
  try {
    const { page = 1, limit = 100 } = req.query;
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
      data: docs
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.getGroupByLeague = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const errorMessages = transformErrorsToMap(errors.array());

    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errorMessages });
    }


    const news = await News.find().sort({ position: "asc" });

    const groupByLeagueArray = [];

    news.forEach((item) => {
      const existingCategory = groupByLeagueArray.find((group) => group.league === item.league);

      if (existingCategory) {
        existingCategory.news.push(item);
      } else {
        groupByLeagueArray.push({
          league: item.league,
          news: [item]
        });
      }
    });

    return res.json({
      status: true,
      message: groupByLeagueArray.length === 0 ? "No News found!" : "Group By News fetched successfully!",
      data: groupByLeagueArray
    });
  } catch (error) {
    console.error(error)
    next(error);
  }
};


exports.getSingleNews = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const news = await News.findOne({ slug });

    const relatedNews = await News.find({
      category: news.category,
      league: news.league,
      _id: { $ne: news.id }
    });

    if (news) {
      return res.json({
        status: true,
        message: "News fetched successfully!",
        data: {
          ...news._doc,
          relatedNews
        }
      });
    } else {
      return res.json({
        status: false,
        message: "No news found!"
      });
    }
  } catch (error) {
    console.error(error)
    next(error);
  }
};
