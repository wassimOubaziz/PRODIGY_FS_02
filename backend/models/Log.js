const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "employee id is required"],
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "manager id is required"],
  },
  entryTime: { type: String, required: [true, "entry time is required"] },
  exitTime: { type: String, required: [true, "exit time is required"] },
  date: { type: Date, required: [true, "date is required"] },
});

module.exports = mongoose.model("Log", LogSchema);
