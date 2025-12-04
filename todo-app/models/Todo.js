const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: String,
  status: { type: String, default: "pending" }, // pending | done
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Todo", todoSchema);