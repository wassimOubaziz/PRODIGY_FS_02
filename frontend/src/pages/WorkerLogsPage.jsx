import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/solid"; // Adjust import based on your setup

const WorkerLogsPage = () => {
  const { workerId } = useParams();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/logs/${workerId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, [workerId]);

  return (
    <div className="mb-8 p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Worker Logs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4 text-left text-sm font-medium tracking-wider">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5" />
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
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-gray-600" />
                    <span>{moment(log.date).format("MM/DD/YYYY")}</span>
                  </div>
                </td>
                <td className="p-4 border-t">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-5 w-5 text-green-600" />
                    <span>{log.entryTime}</span>
                  </div>
                </td>
                <td className="p-4 border-t">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-5 w-5 text-red-600" />
                    <span>{log.exitTime}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkerLogsPage;
