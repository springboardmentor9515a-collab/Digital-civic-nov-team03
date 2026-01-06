const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 200
    },

    options: {
      type: [String],   
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true
    },

    targetLocation: {
      type: String,
      maxlength: 100
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Poll", pollSchema);
