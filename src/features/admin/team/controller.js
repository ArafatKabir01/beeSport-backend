const { sportMonkslUrl } = require("../../../utils/getAxios");
const Team = require("./model");

exports.getTeamsBySearchTerm = async (req, res, next) => {
  const searchTerm = req?.params.searchTerm;

  try {
    const fixtureResponse = await sportMonkslUrl.get(`/teams/search/${searchTerm}`);

    res.status(200).json({
      status: true,
      message: "Successfully retrieve teams data",
      data: fixtureResponse?.data?.data
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.sortTeam = async(req, res, next) => {
  try {
    const {teamData} = req.body;

    await Promise.all(
      teamData?.map(async (team) => {
        const updatedTeam = await Team.findById(team._id);
        updatedTeam.position = team.position;
        await updatedTeam.save();

        return updatedTeam;
      })
    );

    return res.status(200).json({
      status: true,
      message: "team Sorted Successfully!"
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

exports.createTeam = async (req, res, next) => {
  const { teamId, name, image } = req.body;

  try {
    const existingTeam = await Team.findOne({ teamId });

    if (existingTeam) {
      return res.status(401).json({
        message: "already have created team"
      });
    }

    const newTeam = new Team({
      teamId,
      name,
      image
    });

    await newTeam.save();

    res.status(201).json({
      status: true,
      message: "Successfully created team",
      data: newTeam
    });
  } catch (error) {
    error(next);
  }
};

exports.getAllTeam = async (req, res, next) => {
  try {
    const teams = await Team.find();

    res.status(200).json({
      status: true,
      message: "Successfully retrieve all team",
      data: teams
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.deleteTeamById = async (req, res, next) => {
  const teamId = req.params.id;
  try {
    const team = await Team.deleteOne({ teamId });
    res.status(200).json({
      status: true,
      message: "Successfully delete team",
      data: team
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
