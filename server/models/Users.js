import mongoose from "mongoose";
import { regularDatabase } from "../Databases/Databases.js";

const UserSchema = new mongoose.Schema({
  uniqueId: {
    type: Number,
  },
  profile: {
    type: Array,
    default: null,
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
  address: {
    type: String,
    default: null,
  },
  pincode: {
    type: String,
    default: null,
  },
  city: {
    type: String,
    default: null,
  },
  state: {
    type: String,
    default: null,
  },
  country: {
    type: String,
    default: null,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: "Property Manager",
  },
  resetToken: {
    type: String,
    default: null,
  },
  resetTokenExpiry: {
    type: Date,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verifyToken: {
    type: String,
  },
  verifyTokenExpiry: {
    type: Date,
  },
  permissions: {
    type: Array,
    default: [
      { label: "Read Property", value: "Read Property" },
      { label: "Create Property", value: "Create Property" },
      { label: "Update Property", value: "Update Property" },
      { label: "Delete Property", value: "Delete Property" },
    ],
  },
  isGoogleLogin: {
    type: Boolean,
    default: false,
  },
});

const User = regularDatabase.model("User", UserSchema);

export default User;
