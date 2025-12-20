// const mongoose = require("mongoose");

// const PetitionSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: String,
//   owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   status: { type: String, default: "open" }
// }, { timestamps: true });

// PetitionSchema.index({ owner: 1, createdAt: -1 });

// module.exports = mongoose.model("Petition", PetitionSchema);


const mongoose = require("mongoose");

const petitionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "under_review", "closed"],
      default: "under_review",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

petitionSchema.index({ location: 1 });
petitionSchema.index({ category: 1 });
petitionSchema.index({ status: 1 });

module.exports = mongoose.model("Petition", petitionSchema);
