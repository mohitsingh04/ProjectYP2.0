import mongoose from "mongoose";
import { regularDatabase } from "../Databases/Databases.js";

const FaqsSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    uniqueId: {
      type: Number,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    property_id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Faqs = regularDatabase.model("Faqs", FaqsSchema);

export default Faqs;
