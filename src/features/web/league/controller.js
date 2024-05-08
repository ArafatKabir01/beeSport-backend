const League = require("../../admin/league/model");

const getTopLeagues = async (req, res, next) => {
    try {
      const { category } = req.query;
      const query = {};
      if (category) {
        query.category = category;
      }
  
      const [docs, total] = await Promise.all([
        League.find(query).sort({ createdAt: "asc" }),
        League.countDocuments(query)
      ]);
  
      res.status(200).json({
        status: true,
        message: "Top League fetched successfully!",
        data: {
          docs,
          total
        }
      });
    } catch (error) {
      res.status(500).json({ status: false, message: "Something went wrong!" });
    }
  };

  module.exports = {
    getTopLeagues
  }