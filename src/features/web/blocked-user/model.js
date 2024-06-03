const mongoose = require("mongoose");

const blackListSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      enum: ["guest", "logged-in", "subscribed"]
    },
    minutes_watched: {
      type: Number,
      required: true,
      default: 0
    },
    block_period: {
      type: Number,
      required: true
    },
    is_blocked: {
      type: Boolean,
      default: false
    },
    status: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: false,
    versionKey: false
  }
);

const BlackList = mongoose.model("BlackList", blackListSchema);

module.exports = BlackList;
