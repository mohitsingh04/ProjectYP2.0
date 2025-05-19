import mongoose from "mongoose";
import { regularDatabase } from "../Databases/Databases.js";

const applySchema = mongoose.Schema(
  {
    uniqueId: { type: Number, required: true },
    userId: { type: Number, required: true },
    hiringId: { type: Number, required: true },
    status: { type: String, default: "Pending" },
  },
  { timestamp: true }
);

const ApplyHiring = regularDatabase.model("apply-hiring", applySchema);
export default ApplyHiring;
