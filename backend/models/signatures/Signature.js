import mongoose from "mongoose";

const signatureSchema = new mongoose.Schema(
  {
    petitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Petition",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent same user signing twice
signatureSchema.index({ petitionId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Signature", signatureSchema);
