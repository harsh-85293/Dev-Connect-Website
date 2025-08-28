const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true, trim: true, maxlength: 5000 },
  ts: { type: Date, default: Date.now }
}, { timestamps: true });

MessageSchema.index({ fromUserId: 1, toUserId: 1, ts: -1 });

module.exports = mongoose.model("Message", MessageSchema);


