const { getPagination } = require("../../../../utils");
const { sportMonkslUrl } = require("../../../../utils/getAxios");
const Fixture = require("../models/Fixture");


exports.getAllFixtures = async(req, res) => {

    const page = req?.query?.page;
    const limit = req?.query?.limit;
    const date = req?.query?.date

    try{

        const fixtures = await sportMonkslUrl.get(`/fixtures/date/${date}?include=sport;league;participants;scores&per_page=${limit}&page=${page}`);

        res.status(200).json({
            status : true,
            message : "successfully retrieve fixtures data",
            data : fixtures?.data
        })

    }catch(err){
        console.log("error occuring get all fixtures", err)
        res.status(500).json({
            status : false,
            message : "something went wrong",
        })
    }
}


exports.createSelectedFixtures = async(req, res) => {

    const {fixtures} = req?.body;
    const fixtureIds = fixtures?.map((item) => item?.id);
    
    try{

        const fixtureResponse = await sportMonkslUrl.get(`/fixtures/multi/${fixtureIds?.join()}?include=sport;league;participants;scores`);

        const modifiedFixtures = fixtureResponse?.data?.data?.map((fixture) => {

            const selectedFixture = fixtures?.find((item) => item?.id === fixture?.id);

            return {
                name : fixture?.name,
                fixtureId : fixture?.id,
                league : {
                    id : fixture?.league?.id,
                    name : fixture?.league?.name,
                    image : fixture?.league?.image_path
                },
                startingAt : fixture?.starting_at,
                matchType : selectedFixture?.matchType,
                participants : fixture?.participants?.map((participant) => {
                    const currentScore = fixture?.scores?.find((score) => (score?.description === 'CURRENT' && score?.participant_id === participant?.id))
                    return {
                        id : participant?.id,
                        name : participant?.name,
                        image : participant?.image_path,
                        score : currentScore?.score?.goals ? currentScore?.score?.goals : 0
                    }
                })
            }
        });

        const createdFixtures = await Fixture.insertMany(modifiedFixtures);

        res.status(200).json({
            status : true,
            message : "successfully created fixtures data",
            data : createdFixtures
        })

    }catch(err){
        console.log("error occuring get all fixtures", err)
        res.status(500).json({
            status : false,
            message : "something went wrong",
        })
    }
}


exports.getAllFixturesWithPagination = async(req, res) => {

    const page = req?.query?.page;
    const limit = req?.query?.limit;

    try{

        const fixtures = await Fixture.find().skip(page * limit - limit)
        .limit(limit);

        const totalItems = await Fixture.find().count();

        const pagination = getPagination({ totalItems, limit, page });

        res.status(200).json({
            status : true,
            message : "successfully retrieve fixtures data",
            data : fixtures,
            totalItems: pagination?.totalItems,
            page: pagination.page,
            limit: pagination?.limit,
            hasNext: pagination?.next ? true : false,
            hasPrev: pagination?.prev ? true : false
        })

    }catch(err){
        console.log("error occuring get all fixtures", err)
        res.status(500).json({
            status : false,
            message : "something went wrong",
        })
    }
}

exports.getFixtureById = async(req, res) => {
    const fixtureId = req.params.id;

    try{
        const fixture = await Fixture.findById(fixtureId);

        res.status(200).json({
            status : true,
            message : "successfully retrieve fixture data",
            data : fixture,
        })

    }catch(err){
        console.log("error occuring get fixture by id", err)
        res.status(500).json({
            status : false,
            message : "something went wrong",
        })
    }

}

exports.updateFixtureById = async(req, res)=> {
    const fixtureId = req.params.id;
    const {name, status, matchType} = req.body

    try{
        const fixture = await Fixture.findByIdAndUpdate(fixtureId, {name, status, matchType});

        res.status(200).json({
            status : true,
            message : "successfully updated fixture data",
            data : fixture,
        })

    }catch(err){
        console.log("error occuring update fixture", err)
        res.status(500).json({
            status : false,
            message : "something went wrong",
        })
    }
}

exports.deleteFixtureById = async(req, res)=> {
    const fixtureId = req.params.id;

    try{
        const fixture = await Fixture.deleteOne({_id : fixtureId});

        res.status(200).json({
            status : true,
            message : "successfully deleted fixture data",
            data : fixture,
        })

    }catch(err){
        console.log("error occuring update fixture", err)
        res.status(500).json({
            status : false,
            message : "something went wrong",
        })
    }
}