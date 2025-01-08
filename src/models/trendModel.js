const mongoose = require("mongoose");

const trendSchema = new mongoose.Schema({
  ipAddress: { type: String, required: true }, 
  fetchedAt: { type: Date, default: Date.now }, 
  trends: [
    {
      name: { type: String, required: true },
      posts: { type: String }, 
    },
  ],
});

module.exports = mongoose.model("Trend", trendSchema);
