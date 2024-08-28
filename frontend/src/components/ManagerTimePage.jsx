import React, { useEffect, useState } from "react";
import axios from "axios";
import { ClockIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { TrashIcon } from "@heroicons/react/24/solid";

const ManagerTimePage = () => {
  const [newLog, setNewLog] = useState({
    date: "",
    entryTime: "",
    exitTime: "",
    workerId: "",
  });
  const [workers, setWorkers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (
      !localStorage.getItem("token") ||
      !localStorage.getItem("user") ||
      JSON.parse(localStorage.getItem("user")).role !== "manager"
    ) {
      localStorage.clear();
      navigate("/");
      return;
    }

    const fetchWorkers = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/workers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setWorkers(data.workers || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchWorkers();
  }, [navigate]);

  const handleLogChange = (e) => {
    const { name, value } = e.target;
    setNewLog((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitLog = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/logs", newLog, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNewLog({ date: "", entryTime: "", exitTime: "", workerId: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleFireWorker = async (workerId) => {
    try {
      await axios.delete(`http://localhost:5000/api/workers/${workerId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setWorkers((prev) => prev.filter((worker) => worker._id !== workerId));
    } catch (error) {
      console.error("Error firing worker:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Employee Dashboard
      </h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">
          Log Your Entry and Exit Times
        </h2>
        <form
          onSubmit={handleSubmitLog}
          className="bg-white p-4 rounded-lg shadow-md"
        >
          <div className="flex flex-col space-y-4">
            <label className="flex flex-col">
              <span className="text-gray-700 font-medium">Date</span>
              <input
                type="date"
                name="date"
                value={newLog.date}
                onChange={handleLogChange}
                className="p-2 border rounded"
                required
              />
            </label>

            <label className="flex flex-col">
              <span className="text-gray-700 font-medium">Entry Time</span>
              <input
                type="time"
                name="entryTime"
                value={newLog.entryTime}
                onChange={handleLogChange}
                className="p-2 border rounded"
                required
              />
            </label>

            <label className="flex flex-col">
              <span className="text-gray-700 font-medium">Exit Time</span>
              <input
                type="time"
                name="exitTime"
                value={newLog.exitTime}
                onChange={handleLogChange}
                className="p-2 border rounded"
                required
              />
            </label>

            <label className="flex flex-col">
              <span className="text-gray-700 font-medium">Select Worker</span>
              <select
                name="workerId"
                value={newLog.workerId}
                onChange={handleLogChange}
                className="p-2 border rounded"
                required
              >
                <option value="">Select a worker</option>
                {workers.map((worker) => (
                  <option key={worker._id} value={worker._id}>
                    {worker.username}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Submit Log
            </button>
          </div>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4">
          All Workers
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-4 text-left text-sm font-medium tracking-wider">
                  ID
                </th>
                <th className="p-4 text-left text-sm font-medium tracking-wider">
                  Username
                </th>
                <th className="p-4 text-left text-sm font-medium tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {workers.map((worker, i) => (
                <tr
                  key={worker._id}
                  className="odd:bg-gray-50 even:bg-gray-100 hover:bg-blue-50 transition-colors"
                >
                  <td className="p-4 border-t">
                    <span>{i}</span>
                  </td>
                  <td className="p-4 border-t">
                    <Link
                      to={`/manager/time-management/workers/${worker._id}/logs`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {worker.username}
                    </Link>
                  </td>
                  <td className="p-4 border-t">
                    <button
                      type="button"
                      onClick={() => handleFireWorker(worker._id)}
                      className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                    >
                      <TrashIcon className="h-5 w-5" />
                      <span>Fire</span>
                    </button>
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

export default ManagerTimePage;
