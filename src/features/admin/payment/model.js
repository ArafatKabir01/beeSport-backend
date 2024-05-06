const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    payment_id: {
      type: String,
      unique: true,
      required: true
    },
    transaction_id: {
      type: String
    },
    package_price: {
      type: Number
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true
    },
    payment_plan: {
      type: String
    },
    user_email: {
      type: String,
      required: true
    },
    user_name: {
      type: String
    },
    subscription_type: {
      type: String,
      required: true
    },
    subscription_duration: {
      type: String,
      required: true
    },
    auto_renew: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending"
    },
    coupon_applied: {
      type: Boolean,
      default: false
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupons"
    },
    start_date: {
      type: Date,
      default: Date.now
    },
    end_date: {
      type: Date
    },
    renewal_date: {
      type: Date
    },
    payment_method: {
      type: String,
      enum: ["credit_card", "paypal", "bank_transfer"],
      required: true
    },
    payment_status: {
      type: String,
      enum: ["paid", "unpaid", "refunded"],
      default: "unpaid"
    },
    subscription_status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active"
    },
    is_trial: {
      type: Boolean,
      default: false
    },
    trial_end_date: {
      type: Date
    }
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
