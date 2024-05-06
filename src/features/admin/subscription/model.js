const mongoose = require("mongoose");
const moment = require("moment");

const subscriptionSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, default: moment().valueOf() },
    title: {
      type: String,
      required: true
    },
    duration_type: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    discount_status: {
      type: String,
      default: "0"
    },
    discount: {
      type: Number
    },
    discount_start: {
      start: Date
    },
    discount_end: {
      start: Date
    },
    price: [
      {
        country: {
          type: String,
          required: true
        },
        country_code: {
          type: String,
          required: true
        },
        currency_code: {
          type: String,
          required: true
        },
        value: {
          type: String,
          required: true
        },
        discount_value: {
          type: String,
          required: true
        },
        payment_plan: {
          type: String,
          required: true
        },
        allowed_payment_method: [{ type: Object }]
      }
    ],
    status: {
      type: String,
      default: "1",
      required: true
    },
    descriptions: {
      type: [String],
      validate: {
        validator: (value) => value.length >= 1,
        message: "At least one description is required!"
      }
    },
    position: { type: Number, default: 99999999 }
  },
  {
    timestamps: true
  }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
