const { Schema, model } = require("mongoose");

const bannerSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    fixtureId: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const Banner = new model("Banner", bannerSchema);

module.exports = Banner;
