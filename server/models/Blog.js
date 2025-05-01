import mongoose from "mongoose";
import { regularDatabase } from "../Databases/Databases.js";

const blogSchema = mongoose.Schema(
  {
    uniqueId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    blog: {
      type: String,
      required: true,
    },
    category: {
      type: Array,
    },
    tags: {
      type: Array,
    },
    status: {
      type: String,
      default: "Active",
    },
    featured_image: {
      type: Array,
    },
    author: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Blog = regularDatabase.model("blogs", blogSchema);
export default Blog;
