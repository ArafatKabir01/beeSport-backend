const mongoose = require("mongoose");
const popularCricketLeagueSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: {
      type: String,
      required: true
    },
    imagePath: {
      type: String,
      default: null
    },
    country: {
      type: String,
      default: null
    },
    currentSeason: {
      type: String,
      default: null
    },
    position: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const PopularCricketLeague = mongoose.model("PopularCricketLeague", popularCricketLeagueSchema);

module.exports = PopularCricketLeague;
