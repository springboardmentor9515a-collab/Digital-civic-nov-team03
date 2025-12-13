const mongoose = require("mongoose");

const PetitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "open" }
}, { timestamps: true });

PetitionSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model("Petition", PetitionSchema);
