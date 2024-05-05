const { Schema, model } = require("mongoose");

const teamSchema = new Schema(
  {
    teamId: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    position: { type: Number, default: 999999999 },
    image: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Team = new model("Team", teamSchema);

module.exports = Team;
