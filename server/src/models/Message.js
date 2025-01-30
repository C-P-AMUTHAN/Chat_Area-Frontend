const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  sent: { type: Boolean, default: false },
});

module.exports = mongoose.model("Message", messageSchema);
