const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({
  poll: { type: mongoose.Schema.Types.ObjectId, ref: "Poll", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  optionIndex: { type: Number, required: true }
}, { timestamps: true });

VoteSchema.index({ poll: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Vote", VoteSchema);
