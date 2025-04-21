import mongoose from "mongoose";
import { regularDatabase } from "../Databases/Databases.js";

const AccomodationSchema = mongoose.Schema(
  {
    userId: { type: String },
    property_id: { type: String },
    uniqueId: {
      type: String,
      required: true,
    },
    accomodation_name: { type: String },
    accomodation_price: { type: Array },
    accomodation_description: { type: String },
    accomodation_images: {
      type: Array,
      default: "[]",
    },
  },
  { timestamps: true }
);

const Accomodation = regularDatabase.model("accomodation", AccomodationSchema);

export default Accomodation;
