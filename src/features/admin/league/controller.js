const { validationResult } = require("express-validator");
const League = require("./model");

const getAllLeague = async (req, res, next) => {
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
const createLeague = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    const { name, id, image_path, country, currentSeason, category } = req.body;

    const existingLeagues = await League.findOne({
      $and: [{ currentSeason: currentSeason }, { name: name }]
    });

    if (existingLeagues) {
      return res.status(200).json({
        status: false,
        message: "This league already added!"
      });
    }

    const League = new League({
      id,
      name,
      image_path,
      country,
      category,
      currentSeason
    });

    const savedLeague = await League.save();

    res.status(201).json({
      status: true,
      message: "League Added successfully!",
      data: savedLeague
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const sortLeague = async(req, res, next) => {
        try {
          const {leagueWithPosition} = req.body;
      
          await Promise.all(
            leagueWithPosition.map(async (singleLeague) => {
              const league = await League.findOne({ id: singleLeague.id });
              league.position = singleLeague.position;
              await league.save();
      
              return league;
            })
          );
      
          return res.status(200).json({
            status: true,
            message: "Popular League Sorted Successfully!"
          });
        } catch (error) {
          console.error(error);
          next(error);
        }
}

const deleteLeague = async (req, res, next) => {
    try {
      const { id } = req.params;
      const deletedLeague = await League.deleteOne({
        id: id
      });
  
      if (!deletedLeague) {
        return res.status(404).json({ status: false, message: "League not found!" });
      }
  
      res.status(200).json({
        status: true,
        message: "League removed successfully!"
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };


const updatePointTable = async (req, res, next) => {
  try {
    const { id } = req.body;

    await League.updateMany({}, { show_point_table: 0 });

    await League.updateOne(
      {
        id: id
      },
      {
        show_point_table: 1
      }
    );

    res.status(201).json({
      status: true,
      message: "Select point table successfully!"
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  deleteLeague,
  createLeague,
  getAllLeague,
  updatePointTable,
  sortLeague
};
