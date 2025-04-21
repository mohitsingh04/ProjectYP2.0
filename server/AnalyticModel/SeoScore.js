import mongoose from "mongoose";
import { analyticDatabase } from "../Databases/Databases.js";

const seoSchema = mongoose.Schema(
  {
    uniqueId: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
    },
    property_id: {
      type: String,
      required: true,
    },
    seo_score: {
      type: String,
    },
  },
  { timestamp: true }
);

const SeoScore = analyticDatabase.model("seo_score", seoSchema);
export default SeoScore;
