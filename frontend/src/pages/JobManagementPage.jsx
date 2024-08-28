import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JobManagementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    job: "",
    content: "",
    location: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/announcements-manager",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const handleAnnouncementChange = (e) => {
    const { name, value } = e.target;
    setNewAnnouncement((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/announcements-manager",
        newAnnouncement,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setNewAnnouncement({ title: "", job: "", content: "", location: "" });
      fetchAnnouncements();
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/announcements-manager/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  const handleViewJobRequests = (announcementId) => {
    navigate(`/jobs/${announcementId}/jobrequests`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Job Management Dashboard
      </h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">
          Create New Announcement
        </h2>
        <form
          onSubmit={handleCreateAnnouncement}
          className="bg-white p-4 rounded-lg shadow-md"
        >
          <div className="flex flex-col space-y-4">
            {/* Title Field */}
            <label className="flex flex-col">
              <span className="text-gray-700 font-medium">Title</span>
              <input
                type="text"
                name="title"
                value={newAnnouncement.title}
                onChange={handleAnnouncementChange}
                className="p-2 border rounded"
                required
              />
            </label>

            {/* Content Field */}
            <label className="flex flex-col">
              <span className="text-gray-700 font-medium">Content</span>
              <textarea
                name="content"
                value={newAnnouncement.content}
                onChange={handleAnnouncementChange}
                className="p-2 border rounded"
                minLength="100"
                maxLength="500"
                required
              />
            </label>

            {/* Job Field */}
            <label className="flex flex-col">
              <span className="text-gray-700 font-medium">Job</span>
              <input
                type="text"
                name="job"
                value={newAnnouncement.job}
                onChange={handleAnnouncementChange}
                className="p-2 border rounded"
                required
              />
            </label>

            {/* Location Field */}
            <label className="flex flex-col">
              <span className="text-gray-700 font-medium">Location</span>
              <input
                type="text"
                name="location"
                value={newAnnouncement.location}
                onChange={handleAnnouncementChange}
                className="p-2 border rounded"
                required
              />
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Create Announcement
            </button>
          </div>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">
          Announcements
        </h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          {announcements.length === 0 ? (
            <p>No announcements available</p>
          ) : (
            announcements.map((announcement) => (
              <div
                key={announcement._id}
                className="mb-4 p-4 border rounded-lg bg-gray-50"
              >
                <h3 className="text-xl font-semibold">{announcement.title}</h3>
                <p>{announcement.content}</p>
                <div className="flex space-x-4 mt-2">
                  <button
                    onClick={() => handleViewJobRequests(announcement._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    View Job Requests
                  </button>
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete Announcement
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default JobManagementPage;
