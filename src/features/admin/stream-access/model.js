const mongoose = require("mongoose");

const StreamAccessSchema = new mongoose.Schema(
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
    minutesWatched: {
      type: Number,
      required: true,
      default: 0
    },
    blockPeriod: {
      type: Number,
      required: true
    },
    isBlocked: {
      type: Boolean,
      default: false
    },
    popUpOpenedCount: {
      type: Number,
      default: 0
    },
    status: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const StreamAccess = mongoose.model("StreamAccess", StreamAccessSchema);

module.exports = StreamAccess;
