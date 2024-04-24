const Team = require("../../../admin/teams/models/Team");

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