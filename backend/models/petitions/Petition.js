import mongoose from "mongoose";

const petitionSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    targetLocation: String,

    officialResponse: {
      type: String,
      default: null
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    respondedAt: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ["active", "under_review", "closed"],
      default: "active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Petition", petitionSchema);
