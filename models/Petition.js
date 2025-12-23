const mongoose = require("mongoose");

const petitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "under review", "closed"],
      default: "active",
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

// ✅ INDEXES (IMPORTANT FOR FILTERING)
petitionSchema.index({ location: 1 });
petitionSchema.index({ category: 1 });
petitionSchema.index({ status: 1 });

module.exports = mongoose.model("Petition", petitionSchema);
