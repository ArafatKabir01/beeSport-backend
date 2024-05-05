const Team = require("../../admin/team/team.model");

exports.getAllTeam = async (req, res) => {
  try {
    const teams = await Team.find();

    res.status(200).json({
      status: true,
      message: "successfully retrieve all team",
      data: teams
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "something went wrong"
    });
  }
};
