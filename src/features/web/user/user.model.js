const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true
    },
    password: String,
    image: {
      type: String,
      default: null
    },
    role: {
      type: String,
      default: "free"
    },
    subscription_id: {
      type: String,
      default: null
    },
    subscription_duration: {
      type: String,
      default: null
    },
    subscription_type: {
      type: String,
      default: null
    },
    expires_at: {
      type: String,
      default: null
    },
    status: {
      type: String,
      default: "1"
    },
    verify_code: {
      type: String,
      default: null
    },
    email_verified: {
      type: Number,
      default: 0
    },
    provider: String,
    forget_code: {
      type: String,
      default: null
    },
    minutes_watched: {
      type: Number,
      default: 0
    },
    block_period: {
      type: Number,
      default: 0
    },
    is_blocked: {
      type: Boolean,
      default: false
    },
    lastSubscriptionReminderSent: {
      type: Date,
      default: null
    },
    hasExpiredReminderSent: {
      type: Date,
      default: null
    },
    token: String,
    salt: String,
    devices: [
      {
        fingerprint: String,
        lastLogin: String
      }
    ]
  },
  {
    timestamps: true,
    strict: true // Enforce strict validation
  }
);
const User = mongoose.model("Profile", userSchema);
module.exports = User;
