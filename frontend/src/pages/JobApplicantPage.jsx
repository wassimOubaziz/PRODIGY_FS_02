import React, { useState, useEffect } from "react";
import axios from "axios";

const JobApplicantPage = () => {
  const [jobRequests, setJobRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [cvLink, setCvLink] = useState("");

  useEffect(() => {
    const fetchJobRequests = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/announcements/myJobRequests",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setJobRequests(response.data.jobRequests);
      } catch (err) {
        setError("Failed to fetch job requests.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobRequests();
  }, []);

  const handleUpdateCv = async () => {
    if (!cvLink || !selectedJob) return;

    try {
      setIsLoading(true);
      await axios.put(
        `http://localhost:5000/api/announcements/${selectedJob._id}`,
        { cv: cvLink },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSuccessMessage("CV updated successfully.");
      setJobRequests((prev) =>
        prev.map((job) =>
          job._id === selectedJob._id ? { ...job, cv: cvLink } : job
        )
      );
      setCvLink("");
      setSelectedJob(null);
    } catch (err) {
      setError("Failed to update CV.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJobRequest = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:5000/api/announcements/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSuccessMessage("Job request deleted successfully.");
      setJobRequests((prev) => prev.filter((job) => job._id !== id));
    } catch (err) {
      setError("Failed to delete job request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditJobRequest = (job) => {
    setSelectedJob(job);
    setCvLink(job.cv);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {isLoading && <div className="text-center text-blue-500">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {successMessage && (
        <div className="text-center text-green-500">{successMessage}</div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h5 className="bg-gray-800 text-white p-4 text-lg font-semibold">
          Your Applications
        </h5>
        <div className="overflow-x-auto hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CV
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobRequests.map((job) => (
                <tr key={job._id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {job.announcementId.title.length > 16
                      ? `${job.announcementId.title.slice(0, 13)}...`
                      : job.announcementId.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {job.announcementId.job}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <a
                      href={job.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Link
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(job.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {job.status}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => handleDeleteJobRequest(job._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditJobRequest(job)}
                      className="ml-4 text-green-600 hover:text-green-900"
                    >
                      Edit CV
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card layout for small screens */}
        <div className="md:hidden">
          {jobRequests.map((job) => (
            <div
              key={job._id}
              className="bg-white shadow-lg rounded-lg mb-4 p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <h5 className="text-lg font-semibold text-gray-800">
                  {job.announcementId.title.length > 16
                    ? `${job.announcementId.title.slice(0, 13)}...`
                    : job.announcementId.title}
                </h5>
                <span className="text-sm text-gray-500">
                  {new Date(job.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Position: {job.announcementId.job}
              </p>
              <a
                href={job.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline mt-2 inline-block"
              >
                View CV
              </a>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-600">
                  Status: {job.status}
                </span>
                <div className="space-x-2">
                  <button
                    type="button"
                    onClick={() => handleEditJobRequest(job)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Edit CV
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteJobRequest(job._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h5 className="text-lg font-semibold mb-4">Update CV</h5>
            <div className="mb-4">
              <label
                htmlFor="cv"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                CV Link
              </label>
              <input
                type="text"
                id="cv"
                value={cvLink}
                onChange={(e) => setCvLink(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                placeholder="Enter CV link"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleUpdateCv}
                className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                Update CV
              </button>
              <button
                onClick={() => setSelectedJob(null)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplicantPage;
