import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    poll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    optionIndex: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent same user voting twice in same poll
voteSchema.index({ poll: 1, user: 1 }, { unique: true });

export default mongoose.model("Vote", voteSchema);
