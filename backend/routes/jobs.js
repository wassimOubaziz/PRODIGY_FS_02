const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement");
const JobRequest = require("../models/JobRequest");

//get all announcements and job request
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find({})
      .select("-jobRequests")
      .populate({ path: "owner", select: "username -_id" });
    const jobRequests = await JobRequest.find({ user: req.user._id }).populate(
      "announcementId",
      "title job date"
    );

    res.status(200).json({
      status: "success",
      announcements,
      jobRequests: jobRequests || [],
      user: {
        name: req.user.username,
        hasJob: req.user.hasJob,
        role: req.user.role,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "faild",
      message: err.message,
    });
  }
});

//add job Request
router.post("/", async (req, res) => {
  try {
    const { cv, announcementId } = req.body;

    // Check if cv and announcementId are not empty
    if (!cv || !announcementId) {
      return res.status(400).json({
        status: "faild",
        message: "cv is required",
      });
    }

    // Find the announcement by ID
    const announcement = await Announcement.findById(announcementId);
    if (!announcement) {
      return res.status(400).json({
        status: "faild",
        message: "No announcement with this ID",
      });
    }

    // Check if the user has already sent a job request
    const jobRequestExist = await JobRequest.findOne({
      user: req.user._id,
      announcementId,
    });
    if (jobRequestExist) {
      return res.status(400).json({
        status: "faild",
        message: "You already sent a job request",
      });
    }

    // Create a new job request
    const jobRequest = await JobRequest.create({
      user: req.user._id,
      announcementId,
      cv,
    });

    // Add the job request to the announcement
    announcement.jobRequests.push(jobRequest._id);
    await announcement.save();

    res.status(200).json({
      status: "success",
      jobRequest,
    });
  } catch (err) {
    return res.status(400).json({
      status: "faild",
      message: err.message,
    });
  }
});

//delete job request
router.delete("/:id", async (req, res) => {
  try {
    const jobRequest = await JobRequest.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!jobRequest) {
      return res.status(400).json({
        status: "faild",
        message: "no job request with this id",
      });
    }
    //check if the user is the owner of the job request
    if (jobRequest.user.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        status: "faild",
        message: "you are not the owner of this job request",
      });
    }
    //delete the job request from the announcement
    if (jobRequest.status !== "accepted") {
      const announcement = await Announcement.findById(
        jobRequest.announcementId
      );
      announcement.jobRequests.splice(
        announcement.jobRequests.indexOf(jobRequest._id),
        1
      );
      await announcement.save();

      const jobRequests = await JobRequest.find({
        user: req.user._id,
      }).populate("announcementId", "title job date");

      return res.status(200).json({
        status: "success",
        message: "job request deleted successfully",
        jobRequests,
      });
    }

    res.status(400).json({
      status: "faild",
      message: "you can not delete this job request",
    });
  } catch (err) {
    res.status(400).json({
      status: "faild",
      message: err.message,
    });
  }
});

//update job request only the cv
router.put("/:id", async (req, res) => {
  try {
    const jobRequest = await JobRequest.findById(req.params.id);
    if (!jobRequest) {
      return res.status(400).json({
        status: "faild",
        message: "no job request with this id",
      });
    }
    //check if the user is the owner of the job request
    if (jobRequest.user.toString() !== req.user._id.toString()) {
      return res.status(400).json({
        status: "faild",
        message: "you are not the owner of this job request",
      });
    }
    //update the job request
    await JobRequest.findByIdAndUpdate(req.params.id, {
      cv: req.body.cv,
    });

    const jobRequests = await JobRequest.find({ user: req.user._id }).populate(
      "announcementId",
      "title job date"
    );
    res.status(200).json({
      status: "success",
      message: "job request updated",
      jobRequests,
    });
  } catch (err) {
    res.status(400).json({
      status: "faild",
      message: err,
    });
  }
});

//get all jobRequests for the user
router.get("/myJobRequests", async (req, res) => {
  try {
    const jobRequests = await JobRequest.find({ user: req.user._id }).populate(
      "announcementId",
      "title job date"
    );
    res.status(200).json({
      status: "success",
      jobRequests,
    });
  } catch (err) {
    res.status(400).json({
      status: "faild",
      message: err.message,
    });
  }
});

//exports
module.exports = router;
