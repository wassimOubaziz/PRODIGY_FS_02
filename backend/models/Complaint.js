const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
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
  date: { type: Date, default: Date.now },
  complaint: { type: String, required: [true, "complaint is required"] },
  status: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending",
  },
  response: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Complaint", ComplaintSchema);
