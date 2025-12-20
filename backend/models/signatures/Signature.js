// const mongoose = require("mongoose");

// const SignatureSchema = new mongoose.Schema({
//   petition: { type: mongoose.Schema.Types.ObjectId, ref: "Petition", required: true },
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   comment: String
// }, { timestamps: true });

// SignatureSchema.index({ petition: 1, user: 1 }, { unique: true });

// module.exports = mongoose.model("Signature", SignatureSchema);


const mongoose = require("mongoose");

const signatureSchema = new mongoose.Schema(
  {
    petition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Petition",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate signing
signatureSchema.index({ petition: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Signature", signatureSchema);
