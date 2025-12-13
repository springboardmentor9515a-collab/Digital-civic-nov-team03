const mongoose = require("mongoose");

const PollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ text: String, votes: { type: Number, default: 0 } }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "open" }
}, { timestamps: true });

PollSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model("Poll", PollSchema);
