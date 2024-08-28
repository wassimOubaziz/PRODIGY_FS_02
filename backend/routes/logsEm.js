const express = require("express");
const router = express.Router();
const Log = require("../models/Log");

// Get all logs for a specific employee by manger id and employee id
router.get("/", async (req, res) => {
  const employeeId = req.user._id;
  try {
    const logs = await Log.find({ employeeId });
    res.json(logs);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
