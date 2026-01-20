import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema({
  action: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  petition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Petition",
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("AdminLog", adminLogSchema);
