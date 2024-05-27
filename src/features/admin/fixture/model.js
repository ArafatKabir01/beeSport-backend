const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const fixtureSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    fixtureId: Number,
    league: {
      id: Number,
      name: String,
      image: String
    },
    startingAt: String,
    starting_at_timestamp: Number,
    matchType: {
      type: String,
      enum: ["hot", "normal"],
      default: "normal"
    },
    participants: [
      {
        id: Number,
        name: String,
        image: String,
        score: {
          type: Number,
          default: 0
        }
      }
    ],
    status: {
      type: String,
      default: "1"
    },
    live_status: {
      type: Boolean,
      default: false
    },
    streaming_sources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stream"
      }
    ]
  },
  { timestamps: true }
);

const Fixture = new model("Fixture", fixtureSchema);

module.exports = Fixture;
