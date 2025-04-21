import mongoose from "mongoose";
import { regularDatabase } from "../Databases/Databases.js";

const AmenitiesSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: Number,
    },
    propertyId: {
      type: String,
      required: [true, "Property ID is required"],
    },
    selectedAmenities: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Amenities selection is required"],
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Amenities = regularDatabase.model("Amenities", AmenitiesSchema);

export default Amenities;
