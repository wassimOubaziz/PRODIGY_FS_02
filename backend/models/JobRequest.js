const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const jobRequestSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "job request must have worker"],
  },
  announcementId: {
    type: Schema.Types.ObjectId,
    ref: "Announcement",
    required: [true, "job request must have Announcement"],
  },
  cv: {
    type: String,
    required: [true, "job request must have cv"],
    validate: [validator.isURL, "Please provide a valid URL"],
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

jobRequestSchema.index({ user: 1, announcementId: 1 }, { unique: true });

jobRequestSchema.pre("save", async function (next) {
  try {
    const existingJobRequest = await this.constructor.findOne({
      user: this.user,
      announcementId: this.announcementId,
    });

    if (existingJobRequest && !existingJobRequest._id.equals(this._id)) {
      // A document with this user and announcementId already exists, and it's not the same document being saved
      throw new Error("user and announcementId must be unique together");
    }

    // Proceed with saving the document if no conflict is found
    next();
  } catch (err) {
    next(err);
  }
});

const JobRequest = mongoose.model("JobRequest", jobRequestSchema);

module.exports = JobRequest;
