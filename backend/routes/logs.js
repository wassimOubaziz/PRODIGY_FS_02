const express = require("express");
const router = express.Router();
const Log = require("../models/Log");
const User = require("../models/User");

// Get all logs for a specific employee by manger id and employee id
router.get("/:employeeId", async (req, res) => {
  const { employeeId } = req.params;
  try {
    const logs = await Log.find({ employeeId, manager: req.user._id });
    res.json(logs);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  const { workerId, entryTime, exitTime, date } = req.body;
  const employeeId = workerId;
  try {
    // Fetch the current manager (who is making the request)
    const manager = await User.findById(req.user._id);

    if (!manager || manager.role !== "manager") {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Check if the employeeId exists in the manager's workers array
    const isEmployeeUnderManager = manager.workers.some(
      (workerId) => workerId.toString() === employeeId
    );

    if (!isEmployeeUnderManager) {
      return res
        .status(403)
        .json({ message: "Employee is not under your management" });
    }

    // Create a new log entry
    const newLog = new Log({
      employeeId,
      entryTime,
      exitTime,
      date,
      manager: req.user._id,
    });

    // Save the log entry to the database
    await newLog.save();

    res.status(201).json(newLog);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
