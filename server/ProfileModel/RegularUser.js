import mongoose from "mongoose";
import { profileDatabase } from "../Databases/Databases.js";

const regularUserSchema = mongoose.Schema({
  uniqueId: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  mobile_no: {
    type: String,
  },
  alt_mobile_no: {
    type: String,
  },
  avatar: {
    type: Array,
  },
  banner: {
    type: Array,
  },
  password: {
    type: String,
  },
  status: {
    type: String,
    default: "Active",
  },
  isGoogleLogin: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "User",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String,
  },
  verifyTokenExpiry: {
    type: Date,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiry: {
    type: Date,
  },
  professionalToken: {
    type: String,
  },
  professionalTokenExpiry: {
    type: Date,
  },
  deletionToken: {
    type: String,
  },
  deletionTokenExpiry: {
    type: Date,
  },
});

const RegularUser = profileDatabase.model("user", regularUserSchema);

export default RegularUser;
