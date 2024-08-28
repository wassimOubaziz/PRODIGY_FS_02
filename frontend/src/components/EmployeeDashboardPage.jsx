import React, { useEffect, useState } from "react";
import axios from "axios";
import { ClockIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";

const EmployeeDashboardPage = () => {
  const [logs, setLogs] = useState([]);
  const [newLog, setNewLog] = useState({
    date: "",
    entryTime: "",
    exitTime: "",
  });
  const [complaints, setComplaints] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (
      !localStorage.getItem("token") ||
      !localStorage.getItem("user") ||
      JSON.parse(localStorage.getItem("user")).role !== "employee"
    ) {
      localStorage.clear();
      navigate("/");
      return;
    }

    const fetchComplaints = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/complaints/user",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setComplaints(data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();

    const fetchLogs = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/logsEm", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLogs(data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLogs();
  }, [navigate]);

  const handleLogChange = (e) => {
    const { name, value } = e.target;
    setNewLog((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitLog = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/logsEm", newLog, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNewLog({ date: "", entryTime: "", exitTime: "" });
      // Fetch updated logs
      const { data } = await axios.get("http://localhost:5000/api/logs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setLogs(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleComplaintChange = (e) => {
    setComplaint(e.target.value);
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/complaints",
        { complaint },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComplaint("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Employee Dashboard
      </h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">Your Logs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4 text-left text-sm font-medium tracking-wider">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-5 w-5" />
                    <span>Date</span>
                  </div>
                </th>
                <th className="p-4 text-left text-sm font-medium tracking-wider">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-5 w-5" />
                    <span>Entry Time</span>
                  </div>
                </th>
                <th className="p-4 text-left text-sm font-medium tracking-wider">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-5 w-5" />
                    <span>Exit Time</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log._id}
                  className="odd:bg-gray-50 even:bg-gray-100 hover:bg-blue-50 transition-colors"
                >
                  <td className="p-4 border-t">
                    <span>{moment(log.date).format("MM/DD/YYYY")}</span>
                  </td>
                  <td className="p-4 border-t">
                    <span>{log.entryTime}</span>
                  </td>
                  <td className="p-4 border-t">
                    <span>{log.exitTime}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">
          Your Complaints
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4 text-left text-sm font-medium tracking-wider">
                  Date
                </th>
                <th className="p-4 text-left text-sm font-medium tracking-wider">
                  Complaint
                </th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr
                  key={complaint._id}
                  className="odd:bg-gray-50 even:bg-gray-100 hover:bg-blue-50 transition-colors"
                >
                  <td className="p-4 border-t">
                    <div className="flex items-center space-x-2">
                      <span>{moment(complaint.date).format("MM/DD/YYYY")}</span>
                    </div>
                  </td>
                  <td className="p-4 border-t">
                    <Link
                      to={`/employee/complaints/${complaint._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      <span title={`${complaint.complaint}`}>
                        {complaint.complaint.length > 16
                          ? `${complaint.complaint.slice(0, 13)}...`
                          : complaint.complaint}
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboardPage;
