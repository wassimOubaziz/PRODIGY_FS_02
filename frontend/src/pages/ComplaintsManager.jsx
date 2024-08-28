import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaReply, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { MdPending } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const ComplaintsManager = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/complaints",
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
  }, []);

  const handleReply = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const handleResponseChange = (e) => {
    setResponse(e.target.value);
  };

  const handleResponseSubmit = async () => {
    if (!response) return;

    setLoading(true);
    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${selectedComplaint._id}/resolve`,
        { response },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint._id === selectedComplaint._id
            ? { ...complaint, response, status: "resolved" }
            : complaint
        )
      );
      setSelectedComplaint(null);
      setResponse("");
      setLoading(false);
    } catch (error) {
      console.error("Error submitting response:", error);
      setLoading(false);
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case "resolved":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <FaCheck className="mr-1" /> Resolved
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <MdPending className="mr-1" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-semibold text-blue-600 mb-6 text-center">
        Complaints Management
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {complaints.map((complaint) => (
          <div
            key={complaint._id}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <div className="mb-4">
              <span className="text-gray-700 font-semibold">Date: </span>
              <span>{moment(complaint.date).format("MMMM Do, YYYY")}</span>
            </div>
            <div className="mb-4">
              <span className="text-gray-700 font-semibold">Complaint: </span>
              <p className="bg-gray-50 p-3 rounded-md border">
                {complaint.complaint.length > 100
                  ? `${complaint.complaint.slice(0, 100)}...`
                  : complaint.complaint}
              </p>
            </div>
            <div className="mb-4 flex items-center">
              <span className="text-gray-700 font-semibold">Status: </span>
              {renderStatus(complaint.status)}
            </div>
            {complaint.response && (
              <div className="mb-4">
                <span className="text-gray-700 font-semibold">Response: </span>
                <p className="bg-green-50 p-3 rounded-md border text-green-700">
                  {complaint.response}
                </p>
              </div>
            )}
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => handleReply(complaint)}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                <FaReply className="mr-2" />
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedComplaint && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">
              Reply to Complaint
            </h3>
            <p className="mb-4">
              <span className="font-semibold">Complaint: </span>
              {selectedComplaint.complaint}
            </p>
            <textarea
              placeholder="Type your response..."
              value={response}
              onChange={handleResponseChange}
              rows="5"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            ></textarea>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleResponseSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Response"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsManager;
