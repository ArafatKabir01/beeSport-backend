const mongoose = require("mongoose");

const leagueSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    name: {
      type: String,
      unique: true
    },
    image_path: {
      type: String
    },
    category: {
      type: String
    },
    country: {
      type: String
    },
    position: { type: Number, default: 0 },
    currentSeason: {
      type: String
    }
  },
  { timestamps: true }
);

const League = mongoose.model("League", leagueSchema);

module.exports = League;
