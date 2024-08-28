const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "manager", "employee"],
    required: true,
  },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  hasJob: { type: Boolean, default: false },
  workers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  position: { type: String, default: "" },

  changedPasswordAfter: Date,
});

module.exports = mongoose.model("User", UserSchema);
