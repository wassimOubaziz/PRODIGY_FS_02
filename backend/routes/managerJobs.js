const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement");
const JobRequest = require("../models/JobRequest");
const User = require("../models/User");

//get all announcements for owner

router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find({
      owner: req.user._id,
    });
    res.status(200).json(announcements);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//create new announcement
router.post("/", async (req, res) => {
  const { title, job, location, content } = req.body;
  try {
    const newAnnouncement = new Announcement({
      title,
      job,
      location,
      content,
      owner: req.user._id,
    });
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//delete announcement
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Announcement.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//get all job requests for a specific announcement
router.get("/:id/jobRequests", async (req, res) => {
  const { id } = req.params;
  try {
    const jobRequests = await JobRequest.find({ announcementId: id })
      .populate("user", "username")
      .populate("announcementId", "job location");
    res.status(200).json(jobRequests);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//accept job request
router.put("/:id/accept", async (req, res) => {
  const { id } = req.params;
  try {
    // Find the job request
    const jobRequest = await JobRequest.findById(id);
    if (!jobRequest) {
      return res.status(404).json({ message: "Job request not found" });
    }
    if (jobRequest.status === "accepted") {
      return res.status(400).json({ message: "Job request already accepted" });
    }

    // Find the user who made the job request and update their 'hasJob' status
    const user = await User.findById(jobRequest.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.hasJob) {
      return res.status(400).json({ message: "User already has a job" });
    }
    user.position = jobRequest.announcementId.job;
    user.manager = req.user._id;
    user.hasJob = true;
    await user.save();

    // Find the owner (manager) and update their 'workers' array
    const owner = await User.findById(req.user._id);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }
    if (!owner.workers.includes(jobRequest.user)) {
      owner.workers.push(jobRequest.user);
      await owner.save();
    }

    // Update the job request status to 'accepted'
    jobRequest.status = "accepted";
    await jobRequest.save();

    res.status(200).json(jobRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//reject job request
router.put("/:id/reject", async (req, res) => {
  const { id } = req.params;
  try {
    const jobRequest = await JobRequest.findById(id);

    if (!jobRequest) {
      return res.status(400).json({ message: "Job request not found" });
    }
    if (jobRequest.status === "rejected") {
      return res.status(400).json({ message: "Job request already rejected" });
    }
    jobRequest.status = "rejected";
    await jobRequest.save();
    res.status(200).json(jobRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
