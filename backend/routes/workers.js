const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Complaint = require("../models/Complaint");

// Get all employees from workers by manager id

router.get("/", async (req, res) => {
  const { workers } = req.user;
  try {
    //find all the workers inside the user populate them with the username
    const employees = await User.find({ _id: { $in: workers } }).select(
      "username"
    );

    res.json({ workers: employees });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/position", async (req, res) => {
  const { workers } = req.user;
  try {
    //find all the workers inside the user populate them with the username
    const employees = await User.find({ _id: { $in: workers } }).select(
      "username position"
    );

    res.json({ workers: employees });
  } catch (err) {
    res.status(500).json(err);
  }
});

// fire a worker
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "manager") {
      return res.status(400).json({ message: "Cannot delete a manager" });
    }
    const manager = await User.findById(user.manager);
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    // Remove the user from the manager's workers array
    manager.workers = manager.workers.filter(
      (workerId) => workerId.toString() !== id
    );

    await manager.save();

    // Delete all complaints made by the user for this manager
    await Complaint.deleteMany({ employeeId: id, manager: manager._id });

    // Update the user's manager, position, and hasJob status
    await User.findByIdAndUpdate(id, {
      manager: null,
      hasJob: false,
      position: "",
    });

    res.status(204).send();
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
