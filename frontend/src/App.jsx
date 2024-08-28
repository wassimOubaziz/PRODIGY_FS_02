import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";
import AddEmployeePage from "./components/AddEmployeePage";
import Navbar from "./components/Navbar";
import JobApplicantPage from "./pages/JobApplicantPage";
import Jobs from "./pages/Jobs";
import EmployeeDashboardPage from "./components/EmployeeDashboardPage";
import ManagerTimePage from "./components/ManagerTimePage";
import JobManagementPage from "./pages/JobManagementPage";
import JobRequestsPage from "./pages/JobRequestsPage";
import WorkerLogsPage from "./pages/WorkerLogsPage";
import ComplaintDetail from "./pages/ComplaintDetail";
import SubmitComplaint from "./pages/SubmitComplaint";
import ComplaintsManager from "./pages/ComplaintsManager";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/manager/dashboard" element={<DashboardPage />} />
        <Route path="/manager/time-management" element={<ManagerTimePage />} />
        <Route
          path="/manager/time-management/workers/:workerId/logs"
          element={<WorkerLogsPage />}
        />
        <Route path="/manager/jobs" element={<JobManagementPage />} />
        <Route path="/manager/complaints" element={<ComplaintsManager />} />

        <Route
          path="/jobs/:announcementId/jobrequests"
          element={<JobRequestsPage />}
        />
        <Route path="/employee/dashboard" element={<EmployeeDashboardPage />} />
        <Route
          path="/employee/complaints/:complaintId"
          element={<ComplaintDetail />}
        />
        <Route
          path="/employee/submit-complaint"
          element={<SubmitComplaint />}
        />
        <Route path="/admin/dashboard" element={<DashboardPage />} />
        <Route path="/add-employee" element={<AddEmployeePage />} />
        <Route path="/employee/jobs" exact element={<Jobs />}>
          <Route path="applications" element={<JobApplicantPage />} />
        </Route>

        <Route path="/profile" element={<ProfilePage />} />

        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
