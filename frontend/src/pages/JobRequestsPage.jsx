import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const JobRequestsPage = () => {
  const { announcementId } = useParams();
  const [jobRequests, setJobRequests] = useState([]);

  useEffect(() => {
    fetchJobRequests();
  }, []);

  const fetchJobRequests = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/announcements-manager/${announcementId}/jobrequests`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setJobRequests(data);
    } catch (error) {
      console.error("Error fetching job requests:", error);
    }
  };

  const handleJobRequestActionRejected = async (requestId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/announcements-manager/${requestId}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchJobRequests();
    } catch (error) {
      console.error(`Error updating job request status to ${status}:`, error);
    }
  };

  const handleJobRequestActionAccepted = async (requestId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/announcements-manager/${requestId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchJobRequests();
    } catch (error) {
      console.error(`Error updating job request status to ${status}:`, error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Job Requests for Announcement
      </h1>

      <div className="bg-white p-4 rounded-lg shadow-md">
        {jobRequests.length === 0 ? (
          <p>No job requests available</p>
        ) : (
          jobRequests.map((request) =>
            request.status !== "rejected" && request.status !== "accepted" ? (
              <div
                key={request?._id}
                className="mb-6 p-6 border border-gray-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-2xl font-semibold text-blue-800">
                  {request.user.username}
                </h3>
                <p className="text-lg text-gray-700 mt-1">
                  <span className="font-medium">Position:</span>{" "}
                  {request.announcementId.job}
                </p>
                <p className="text-lg text-gray-700 mt-1">
                  <span className="font-medium">Status:</span> {request.status}
                </p>
                <p className="text-lg text-gray-700 mt-1">
                  <span className="font-medium">Location:</span>{" "}
                  {request.announcementId.location}
                </p>
                <p className="text-lg text-gray-700 mt-1">
                  <span className="font-medium">Requested on:</span>{" "}
                  {moment(request.date).format("MMMM D, YYYY")}
                </p>
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() =>
                      handleJobRequestActionAccepted(request._id, "accepted")
                    }
                    className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      handleJobRequestActionRejected(request._id, "rejected")
                    }
                    className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ) : (
              <></>
            )
          )
        )}
      </div>
    </div>
  );
};

export default JobRequestsPage;
