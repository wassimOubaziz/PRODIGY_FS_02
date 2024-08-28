import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { MdOutlineDone, MdPending } from "react-icons/md";
import Modal from "../components/Modal"; // Import the Modal component

const ComplaintDetail = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedComplaint, setEditedComplaint] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/complaints/${complaintId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setComplaint(data);
        setEditedComplaint(data.complaint); // Set initial complaint text for editing
      } catch (error) {
        console.error("Error fetching complaint:", error);
      }
    };

    fetchComplaint();
  }, [complaintId]);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/complaints/${complaintId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/employee/dashboard"); // Redirect to complaints list after deletion
    } catch (error) {
      console.error("Error deleting complaint:", error);
    }
  };

  const handleEditSave = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/complaints/${complaintId}`,
        { complaint: editedComplaint },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComplaint({ ...complaint, complaint: editedComplaint });
      setIsEditModalOpen(false); // Close the modal after saving
    } catch (error) {
      console.error("Error saving complaint:", error);
    }
  };

  if (!complaint) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mb-8 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-blue-600 mb-6">
        Complaint Details
      </h2>
      <div className="bg-white p-6 rounded-lg shadow-lg">
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
          <span
            className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              complaint.status === "resolved"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {complaint.status === "resolved" ? (
              <>
                <MdOutlineDone className="mr-1" />
                Resolved
              </>
            ) : (
              <>
                <MdPending className="mr-1" />
                Pending
              </>
            )}
          </span>
        </div>
        {complaint.status === "resolved" && complaint.response && (
          <div className="mb-4">
            <span className="text-gray-700 font-semibold">Response: </span>
            <p className="bg-green-50 p-3 rounded-md border text-green-700">
              {complaint.response}
            </p>
          </div>
        )}
        <div className="flex space-x-4 mt-6">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            <AiOutlineEdit className="mr-2" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <AiOutlineDelete className="mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Edit Complaint Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h3 className="text-2xl font-semibold mb-4">Edit Complaint</h3>
        <textarea
          className="w-full p-2 mb-4 border rounded-md"
          rows="4"
          value={editedComplaint}
          onChange={(e) => setEditedComplaint(e.target.value)}
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleEditSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ComplaintDetail;
