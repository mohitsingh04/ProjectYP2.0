import mongoose from "mongoose";
import { profileDatabase } from "../Databases/Databases.js";

const profileLocationSchema = mongoose.Schema(
  {
    unqueId: {
      type: Number,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
    },
    pincode: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  { timestamps: true }
);

const ProfileLocation = profileDatabase.model(
  "location",
  profileLocationSchema
);

export default ProfileLocation;
