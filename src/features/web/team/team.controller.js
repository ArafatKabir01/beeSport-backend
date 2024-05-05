const Team = require("../../admin/team/team.model");

exports.getAllTeam = async (req, res, next) => {
  try {
    const teams = await Team.find();

    res.status(200).json({
      status: true,
      message: "successfully retrieve all team",
      data: teams
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
