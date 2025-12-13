const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri);
  const models = mongoose.modelNames();
  for (const m of models) {
    try { await mongoose.model(m).init(); } catch (e) {}
  }
}

module.exports = connectDB;
