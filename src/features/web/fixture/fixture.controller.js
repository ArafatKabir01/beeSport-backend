const { getPagination } = require("../../../utils");
const Fixture = require("../../admin/fixture/fixture.model");

exports.getAllFixtures = async (req, res, next) => {
  const page = req?.query?.page;
  const limit = req?.query?.limit;

  try {
    const fixtures = await Fixture.find()
      .populate("streaming_sources")
      .skip(page * limit - limit)
      .limit(limit);

    const totalItems = await Fixture.find().count();

    const pagination = getPagination({ totalItems, limit, page });

    res.status(200).json({
      status: true,
      message: "successfully retrieve fixtures data",
      data: fixtures,
      totalItems: pagination?.totalItems,
      page: pagination.page,
      limit: pagination?.limit,
      hasNext: pagination?.next ? true : false,
      hasPrev: pagination?.prev ? true : false
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.getFixtureById = async (req, res, next) => {
  const fixtureId = req.params.id;

  try {
    const fixture = await Fixture.find({ fixtureId }).populate("streaming_sources");

    res.status(200).json({
      status: true,
      message: "successfully retrieve fixture data",
      data: fixture[0]
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
