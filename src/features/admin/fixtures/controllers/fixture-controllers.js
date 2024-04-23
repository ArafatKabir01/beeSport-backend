const Stream = require("../../../../models/Stream");
const { createStreaming } = require("../../../../services/matchServices");
const { getPagination, generateRandomId } = require("../../../../utils");
const { sportMonkslUrl } = require("../../../../utils/getAxios");
const Fixture = require("../models/Fixture");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const CloudinaryStorage = require("multer-storage-cloudinary").CloudinaryStorage;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "asia-sports/live-match", // optional: specify a folder in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"]
    // public_id: (req, file) => `${file.fieldname.replace(fileExt, "").toLowerCase().split(" ").join("-") + Date.now()}`
  }
});

// const storage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

const upload = multer({
  storage,
  limits: {
    fileSize: 5000000 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = ["image/png", "image/jpg", "image/jpeg"];
    const validMimeType = allowedImageTypes.includes(file.mimetype);

    if ((file.fieldname === "team_one_image" || file.fieldname === "team_two_image") && validMimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .png, or .jpeg format allowed!"));
    }
  }
});


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

    try {
        upload.fields([
          {
            name: "team_one_image",
            maxCount: 1
          },
          {
            name: "team_two_image",
            maxCount: 1
          }
        ])(req, res, async (err) => {
          if (err instanceof multer.MulterError) {
            console.error(err);
            return res.status(500).json({ error: "Multer error!" });
          } else if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error uploading file!" });
          }

    
          const matchData = req.body;
          const fixtureResponse = await sportMonkslUrl.get(`/fixtures/${matchData?.fixture_id}?include=sport;league;participants;scores`);

          const newFixture = new Fixture({
            name : fixtureResponse?.data?.data?.name,
            fixtureId : fixtureResponse?.data?.data?.id,
            league : {
                id : fixtureResponse?.data?.data?.league?.id,
                name : fixtureResponse?.data?.data?.league?.name,
                image : fixtureResponse?.data?.data?.league?.image_path
            },
            startingAt : fixtureResponse?.data?.data?.starting_at,
            matchType : matchData?.is_hot === '0' ? "normal" : "hot",
            status : matchData?.status,
            streaming_sources : [],
            participants : fixtureResponse?.data?.data?.participants?.map((participant) => {
                const currentScore = fixtureResponse?.data?.data?.scores?.find((score) => (score?.description === 'CURRENT' && score?.participant_id === participant?.id))
                return {
                    id : participant?.id,
                    name : participant?.name,
                    image : participant?.image_path,
                    score : currentScore?.score?.goals ? currentScore?.score?.goals : 0
                }
            })
        })
          const streamingData = createStreaming(JSON.parse(matchData.streaming_sources));

    
          if (matchData?.team_one_image_type === "image") {
            matchData.team_one_image = req.files?.team_one_image[0].path || null;
          } else {
            matchData.team_one_image = matchData?.team_one_image_url;
          }
    
          if (matchData?.team_two_image_type === "image") {
            matchData.team_two_image = req.files?.team_two_image[0].path || null;
          } else {
            matchData.team_two_image = matchData?.team_two_image_url;
          }
    
          const createdStreams = await Promise.all(
            streamingData.map(async (streamData) => {
              const newStream = new Stream({
                id: generateRandomId(15),
                matchId: newFixture._id,
                ...streamData
              });
    
              newFixture.streaming_sources.push(newStream._id);
              await newStream.save();
              return newStream;
            })
          );
    
          await newFixture.save();
    
          return res.status(200).json({
            status: true,
            message: "fixture created successfully!",
            data: { fixture: newFixture, streams: createdStreams }
          });
        });
      } catch (error) {
        console.log("error",error);
        return res.status(500).json({
          status: false,
          message: "An error occurred while creating the match!"
        });
      }
}


exports.getAllFixturesWithPagination = async(req, res) => {

    const page = req?.query?.page;
    const limit = req?.query?.limit;

    try{
        let groupByLeague = [];

        const fixtures = await Fixture.find().skip(page * limit - limit)
        .limit(limit);

        const fixtureIds = fixtures?.map((item) => item.fixtureId);

        let uniqueArr = Array.from(new Set(fixtureIds));

        const fixtureResponse = await sportMonkslUrl.get(`/fixtures/multi/${uniqueArr?.join()}?include=league.country;round.stage;participants;state;scores;periods`);
        
        fixtureResponse?.data?.data.forEach((fixture) => {
            const leagueIndex = groupByLeague.findIndex((league) => league.id === fixture.league.id);
    
            if (leagueIndex !== -1) {
              groupByLeague[leagueIndex].fixtures.push(fixture);
            } else {
              groupByLeague.push({
                id: fixture.league.id,
                name: fixture.league.name,
                image: fixture.league.image_path,
                fixtures: [fixture]
              });
            }
          });

        const totalItems = await Fixture.find().count();

        const pagination = getPagination({ totalItems, limit, page });

        res.status(200).json({
            status : true,
            message : "Group-Wise Fixture Data Fetched Successfully!",
            data : groupByLeague,
            totalItems: pagination?.totalItems,
            page: pagination.page,
            limit: pagination?.limit,
            hasNext: pagination?.next ? true : false,
            hasPrev: pagination?.prev ? true : false
        })

    }catch(err){
        console.log("error occuring get all fixtures")
        res.status(500).json({
            status : false,
            message : "something went wrong",
        })
    }
}

exports.getFixtureById = async(req, res) => {
    const fixtureId = parseInt(req.params.id);

    try{
        const fixture = await Fixture.findOne({fixtureId}).populate('streaming_sources');

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

exports.refreashFixtureById = async(req, res) => {
    const fixtureId = req.params.id;
    try{
        const fixtureResponse = await sportMonkslUrl.get(`/fixtures/${fixtureId}?include=sport;league;participants;scores`);

        const fixture = await Fixture.findOneAndUpdate({fixtureId}, { participants : fixtureResponse?.data?.data?.participants?.map((participant) => {
            const currentScore = fixtureResponse?.data?.data?.scores?.find((score) => (score?.description === 'CURRENT' && score?.participant_id === participant?.id))
            return {
                id : participant?.id,
                name : participant?.name,
                image : participant?.image_path,
                score : currentScore?.score?.goals ? currentScore?.score?.goals : 0
            }
        })});

        res.status(200).json({
            status : true,
            message : "successfully refreash fixture data",
            data : fixture,
        })
    }catch(err){
        console.log("error occuring refreash fixture by id", err)
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
        const fixture = await Fixture.findOneAndUpdate({fixtureId}, {name, status, matchType});

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
        const fixture = await Fixture.deleteOne({fixtureId});

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