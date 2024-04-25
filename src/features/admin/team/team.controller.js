
const { sportMonkslUrl } = require("../../../utils/getAxios");
const Team = require("./team.model");

exports.getTeamsBySearchTerm = async(req, res) => {
    const searchTerm = req?.params.searchTerm;

    try{

        const fixtureResponse = await sportMonkslUrl.get(`/teams/search/${searchTerm}`);

        res.status(200).json({
            status : true,
            message : "successfully retrieve teams data",
            data : fixtureResponse?.data?.data
        })

    }catch(err){
        console.log("error occuring retrieve teams", err)
        res.status(500).json({
            status : false,
            message : "something went wrong",
        })

    }
}

exports.createTeam = async(req, res) => {
    const {teamId, name, image} = req.body;

    try{
        
    const existingTeam = await Team.findOne({teamId});

    if(existingTeam){
        return res.status(401).json({
            message: "already have created team"
        })
    }

    const newTeam = new Team({
        teamId, 
        name, 
        image
    });

    await newTeam.save();

    
    res.status(201).json({
        status : true,
        message : "successfully created team",
        data : newTeam
    });

    }catch(err){
        console.log("error occuring create team", err)
        res.status(500).json({
            status : false,
            message : "something went wrong",
        })
    }
}



exports.getAllTeam = async(req, res) => {

    try{
        
    const teams = await Team.find();

    res.status(200).json({
        status : true,
        message : "successfully retrieve all team",
        data : teams
    });

    }catch(err){
        console.log("error occuring get all team", err)
        res.status(500).json({
            status : false,
            message : "something went wrong",
        })
    }
}

exports.deleteTeamById = async(req, res) => {
    const teamId = req.params.id;
    try{
        const team = await Team.deleteOne({teamId});
        res.status(200).json({
            status : true,
            message : "successfully delete team",
            data : team
        });

    }catch(err){
        console.log("error occuring get all team", err)
        res.status(500).json({
            status : false,
            message : "something went wrong",
        })
    }
}