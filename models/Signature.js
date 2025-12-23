const mongoose = require("mongoose");

const signatureSchema = new mongoose.Schema(
  {
    petitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Petition",
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt
  }
);

// ✅ UNIQUE COMPOUND INDEX
signatureSchema.index(
  { petitionId: 1, userId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Signature", signatureSchema);
