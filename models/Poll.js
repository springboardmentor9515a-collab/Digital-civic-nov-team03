const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    options: {
      type: [String],
      required: true,
    },

    // 🔥 FIX IS HERE
    createdBy: {
      type: String,   // ❌ NOT ObjectId
      required: true,
    },

    targetLocation: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Poll", pollSchema);
