import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCommentDots } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setComplaint(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      setLoading(false);
      navigate("/employee/dashboard"); // Redirect to complaints list after submission
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-blue-600 mb-6 text-center">
          Submit a Complaint
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <FaCommentDots className="inline-block mr-2" /> Complaint
            </label>
            <textarea
              name="complaint"
              placeholder="Describe your complaint..."
              value={complaint}
              onChange={handleChange}
              required
              rows="5"
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? (
              <span className="loader"></span>
            ) : (
              <>
                <IoIosSend className="mr-2" />
                Submit Complaint
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;
