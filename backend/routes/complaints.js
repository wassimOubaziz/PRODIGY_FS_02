const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// Get all complaints by manager id
router.get("/", async (req, res) => {
  const managerId = req.user._id;
  try {
    const complaints = await Complaint.find({ manager: managerId });
    res.json(complaints);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all complaints by user id

router.get("/user", async (req, res) => {
  const userId = req.user._id;
  try {
    const complaints = await Complaint.find({ employeeId: userId });
    res.json(complaints);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get complaint of the user by complaint id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const complaint = await Complaint.findById(id).populate(
      "employeeId",
      "username"
    );
    res.json(complaint);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create complaint

router.post("/", async (req, res) => {
  const { complaint } = req.body;
  try {
    const newComplaint = new Complaint({
      complaint,
      employeeId: req.user._id,
      manager: req.user.manager,
    });
    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update complaint
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { complaint } = req.body;
  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { complaint },
      { new: true }
    );
    res.json(updatedComplaint);
  } catch (err) {
    res.status(500).json(err);
  }
});
// Remove complaint
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Complaint.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json(err);
  }
});

//resolve complaint
router.put("/:id/resolve", async (req, res) => {
  const { id } = req.params;
  const { response } = req.body;
  try {
    await Complaint.findByIdAndUpdate(id, { status: "resolved", response });
    res.status(204).send();
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
