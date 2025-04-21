import mongoose from "mongoose";
import { regularDatabase } from "../Databases/Databases.js";

const couponSchema = mongoose.Schema(
  {
    uniqueId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    property_id: {
      type: String,
      required: true,
    },
    coupon_code: {
      type: String,
      required: true,
    },
    start_from: {
      type: Date,
      required: true,
    },
    valid_upto: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Coupon = regularDatabase.model("coupons", couponSchema);
export default Coupon;
