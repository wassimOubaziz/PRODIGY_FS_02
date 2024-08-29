import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserIcon, BriefcaseIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !localStorage.getItem("token") ||
      !localStorage.getItem("user") ||
      JSON.parse(localStorage.getItem("user")).role === "employee"
    ) {
      localStorage.clear();
      navigate("/");
      return;
    }

    const fetchEmployees = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/workers/position",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEmployees(data?.workers || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEmployees();
  }, [navigate]);

  const handleFire = async (employeeId) => {
    try {
      await axios.delete(`http://localhost:5000/api/workers/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEmployees(employees.filter((employee) => employee._id !== employeeId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Manager Dashboard
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4 text-left text-sm font-medium tracking-wider">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-5 w-5" />
                  <span>Username</span>
                </div>
              </th>

              <th className="p-4 text-left text-sm font-medium tracking-wider">
                <div className="flex items-center space-x-2">
                  <BriefcaseIcon className="h-5 w-5" />
                  <span>Position</span>
                </div>
              </th>

              <th className="p-4 text-left text-sm font-medium tracking-wider">
                <div className="flex items-center space-x-2">
                  <span>Action</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee._id}
                className="odd:bg-gray-50 even:bg-gray-100 hover:bg-blue-50 transition-colors"
              >
                <td className="p-4 border-t">
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-6 w-6 text-blue-500" />
                    <Link
                      to={`/manager/time-management/workers/${employee._id}/logs`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {employee.username}
                    </Link>
                  </div>
                </td>

                <td className="p-4 border-t">
                  <div className="flex items-center space-x-3">
                    <BriefcaseIcon className="h-6 w-6 text-blue-500" />
                    <span>{employee.position}</span>
                  </div>
                </td>

                <td className="p-4 border-t">
                  <button
                    onClick={() => handleFire(employee._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md flex items-center space-x-2 hover:bg-red-700 transition-colors"
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
  );
};

export default DashboardPage;
