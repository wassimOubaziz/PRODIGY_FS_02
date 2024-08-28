import React, { useEffect, useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  HomeIcon,
  PlusIcon,
  UserCircleIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const userData = JSON.parse(localStorage.getItem("user"));
        setUser(userData);
      } else {
        setUser(null);
      }
    };

    fetchUser();

    // Optional: Listen for changes to localStorage
    window.addEventListener("storage", fetchUser);

    return () => {
      window.removeEventListener("storage", fetchUser);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/"
            className="text-white font-bold text-xl flex items-center space-x-2"
          >
            <HomeIcon className="h-6 w-6" />
            <span>Home</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          {user && (user.role === "admin" || user.role === "manager") && (
            <>
              <Link
                to="/manager/dashboard"
                className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
              >
                <UserCircleIcon className="h-5 w-5" />
                <span>Manager Dashboard</span>
              </Link>
              <Link
                to="/manager/time-management"
                className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
              >
                <CogIcon className="h-5 w-5" />
                <span>Time Management</span>
              </Link>
              <Link
                to="/manager/jobs"
                className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Job Management</span>
              </Link>
              <Link
                to="/manager/complaints"
                className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
              >
                <CogIcon className="h-5 w-5" />
                <span>Complaints</span>
              </Link>
            </>
          )}
          {user && user.role === "employee" && (
            <>
              <Link
                to="/employee/dashboard"
                className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
              >
                <UserCircleIcon className="h-5 w-5" />
                <span>Employee Dashboard</span>
              </Link>
              <Link
                to="/employee/submit-complaint"
                className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Submit Complaint</span>
              </Link>
            </>
          )}
          {user && (
            <Menu as="div" className="relative">
              <Menu.Button className="bg-gray-800 text-white flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium">
                <UserCircleIcon className="h-5 w-5" />
                <span>{user.name}</span>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 w-48 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="p-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={`${
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700"
                          } group flex rounded-md items-center p-2 text-sm`}
                        >
                          <CogIcon className="h-5 w-5 mr-2" />
                          <span>Profile Settings</span>
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                  <div className="p-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700"
                          } group flex rounded-md items-center p-2 text-sm w-full text-left`}
                        >
                          <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                          <span>Logout</span>
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
          {!user && (
            <Link
              to="/register"
              className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
            >
              <UserPlusIcon className="h-5 w-5" />
              <span>Register</span>
            </Link>
          )}
        </div>
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            {isOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition ease-out duration-200 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-150 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user && (user.role === "admin" || user.role === "manager") && (
              <>
                <Link
                  to="/manager/dashboard"
                  className="hover:bg-gray-700 text-white px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <UserCircleIcon className="h-5 w-5" />
                  <span>Manager Dashboard</span>
                </Link>
                <Link
                  to="/manager/time-management"
                  className="hover:bg-gray-700 text-white px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <CogIcon className="h-5 w-5" />
                  <span>Time Management</span>
                </Link>
                <Link
                  to="/manager/jobs"
                  className="hover:bg-gray-700 text-white px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Job Management</span>
                </Link>
                <Link
                  to="/manager/complaints"
                  className="hover:bg-gray-700 text-white px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <CogIcon className="h-5 w-5" />
                  <span>Complaints</span>
                </Link>
              </>
            )}
            {user && user.role === "employee" && (
              <>
                <Link
                  to="/employee/dashboard"
                  className="hover:bg-gray-700 text-white px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <UserCircleIcon className="h-5 w-5" />
                  <span>Employee Dashboard</span>
                </Link>
                <Link
                  to="/employee/submit-complaint"
                  className="hover:bg-gray-700 text-white px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Submit Complaint</span>
                </Link>
              </>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="hover:bg-gray-700 text-white px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 w-full"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/register"
                className="hover:bg-gray-700 text-white px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 w-full"
                onClick={() => setIsOpen(false)}
              >
                <UserPlusIcon className="h-5 w-5" />
                <span>Register</span>
              </Link>
            )}
          </div>
        </div>
      </Transition>
    </nav>
  );
};

export default Navbar;
