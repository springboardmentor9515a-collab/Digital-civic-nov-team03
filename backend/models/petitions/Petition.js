import mongoose from "mongoose";

const petitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes for faster filtering
petitionSchema.index({ location: 1 });
petitionSchema.index({ category: 1 });
petitionSchema.index({ status: 1 });

export default mongoose.model("Petition", petitionSchema);
