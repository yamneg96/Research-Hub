import mongoose from "mongoose";

const ResearchDocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      default: "",
      trim: true
    },
    thumbnail: {
      type: String,
      default: "",
      trim: true
    },
    coverImage: {
      type: String,
      default: "",
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    pin: {
      type: String,
      default: "",
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("ResearchDocument", ResearchDocumentSchema);
