require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { protect, permition, checkJob } = require("./middleware/auth");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/employee-management", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userRoutes = require("./routes/users");
const employeeRoutes = require("./routes/employees");
const jobRoutes = require("./routes/jobs");
const managerJobs = require("./routes/managerJobs");
const workersRoutes = require("./routes/workers");

app.use("/api/users", userRoutes);
app.use("/api/employees", protect, employeeRoutes);
app.use(
  "/api/announcements",
  protect,
  permition("employee", "admin"),
  jobRoutes
);

app.use(
  "/api/announcements-manager",
  protect,
  permition("manager", "admin"),
  managerJobs
);

app.use("/api/workers", protect, permition("manager", "admin"), workersRoutes);
app.use(
  "/api/logs",
  protect,
  permition("manager", "admin"),
  require("./routes/logs")
);

app.use(
  "/api/logsEm",
  protect,
  checkJob,
  permition("employee", "admin"),
  require("./routes/logsEm")
);

app.use("/api/complaints", protect, require("./routes/complaints"));
app.use("/api/user/profile", protect, require("./routes/profiles"));

app.listen(5000, () => console.log("Server running on port 5000"));
