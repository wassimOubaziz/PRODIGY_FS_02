import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useOutlet } from "react-router-dom";
import axios from "axios";
import Highlighter from "react-highlight-words";
import moment from "moment";

function Jobs() {
  const [announcements, setAnnouncements] = useState([]); // Data fetching logic
  const [jobRequests, setJobRequests] = useState([]); // Data fetching logic
  const [formVisible, setFormVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobRequest, setJobRequest] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const outlet = useOutlet();
  const navigate = useNavigate();

  // Search logic by role, location, title, and content
  const searchByRoleAndLocation = () => {
    return announcements.filter(
      (an) =>
        an.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        an.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        an.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        an.owner?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const showForm = (job) => {
    setSelectedJob(job);
    setFormVisible(true);
  };

  const handleClose = () => {
    setFormVisible(false);
    setSelectedJob(null);
  };

  const handleForm = (e) => {
    e.preventDefault();
    // Form submission logic here

    // Send the CV to the server and all the details
    const cv = e.target.cv.value;
    const announcementId = selectedJob._id;
    axios
      .post(
        "http://localhost:5000/api/announcements",
        { cv, announcementId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setJobRequest(res.data.jobRequest);
      })
      .catch((err) => {
        console.error(err);
      });

    // Update the UI
    setJobRequests([
      ...jobRequests,
      {
        announcementId: selectedJob,
        cv,
      },
    ]);

    // Close the form
    handleClose();
  };

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user")).role !== "employee") {
      navigator("/");
    }
    const fetchAnnouncements = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/announcements",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAnnouncements(data.announcements);
        setJobRequests(data.jobRequests);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      {!outlet ? (
        <>
          <div className="text-center mb-8">
            <h4 className="text-2xl font-semibold text-gray-700">
              Welcome{" "}
              {JSON.parse(localStorage.getItem("user")).username.toUpperCase()}
            </h4>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-blue-800">Announcements</h2>
          </div>

          {/* Search Input */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                className="form-input block w-full pl-4 p-2 pr-16 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                placeholder="Search by role, location, title, or content"
                aria-label="Search by role, location, title, or content"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="absolute inset-y-0 right-0 flex items-center px-4 text-white bg-blue-600 border border-transparent rounded-r-lg shadow-md hover:bg-blue-700"
                onClick={searchByRoleAndLocation}
              >
                <i className="bx bx-search-alt text-xl"></i>
              </button>
            </div>
          </div>

          {/* Announcements List */}
          <div>
            {searchByRoleAndLocation().length > 0 ? (
              searchByRoleAndLocation().map((an) => (
                <div
                  key={an._id}
                  className="bg-white p-6 mb-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-2xl font-bold text-blue-700 mb-2">
                    <Highlighter
                      highlightClassName="bg-yellow-300"
                      searchWords={[searchQuery]}
                      autoEscape={true}
                      textToHighlight={`Job Vacancy: ${an?.title}`}
                    />
                  </h3>
                  <p className="text-lg text-gray-600 mb-2">
                    <Highlighter
                      highlightClassName="bg-yellow-300"
                      searchWords={[searchQuery]}
                      autoEscape={true}
                      textToHighlight={`Location: ${an?.location.toUpperCase()}`}
                    />
                  </p>
                  <p className="text-base text-gray-700 mb-4">
                    <Highlighter
                      highlightClassName="bg-yellow-300"
                      searchWords={[searchQuery]}
                      autoEscape={true}
                      textToHighlight={an?.content}
                    />
                  </p>
                  <h5 className="text-base font-semibold text-gray-800 mb-2">
                    Posted by:{" "}
                    <Highlighter
                      highlightClassName="bg-yellow-300"
                      searchWords={[searchQuery]}
                      autoEscape={true}
                      textToHighlight={`${an?.owner?.username}`}
                    />
                  </h5>
                  <h5 className="text-base font-medium text-gray-600">
                    Posted: {moment(an.date).fromNow()}
                  </h5>
                  <div className="flex items-center justify-between mt-4">
                    <button
                      className={`px-4 py-2 rounded-lg shadow ${
                        jobRequests.some(
                          (obj) => obj.announcementId._id === an._id
                        )
                          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                      onClick={() => showForm(an)}
                      disabled={jobRequests.some(
                        (obj) => obj.announcementId._id === an._id
                      )}
                    >
                      {jobRequests.some(
                        (obj) => obj.announcementId._id === an._id
                      )
                        ? "Applied"
                        : localStorage.getItem("token")
                        ? "Apply Now"
                        : "Login to apply"}
                    </button>
                    {jobRequests.some(
                      (obj) => obj.announcementId._id === an._id
                    ) && (
                      <i className="bx bx-check text-green-500 text-2xl font-bold"></i>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No announcements yet...
              </p>
            )}
          </div>

          {/* Form to Submit CV */}
          {formVisible && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
              <form
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
                onSubmit={handleForm}
              >
                <h5 className="text-2xl font-semibold mb-4">
                  Apply for this job
                </h5>
                <div className="mb-4">
                  <label
                    htmlFor="formFile"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    URL to your CV
                  </label>
                  <input
                    className="form-input p-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    type="text"
                    id="formFile"
                    placeholder="URL"
                    name="cv"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
                    type="submit"
                  >
                    Submit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
                    onClick={(e) => {
                      e.preventDefault();
                      handleClose();
                    }}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      ) : (
        <Outlet />
      )}

      {/* Buttons for Navigation */}
      <div className="fixed bottom-4 right-4">
        {outlet ? (
          <Link
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 flex items-center"
            to="/employee/jobs"
          >
            <i className="bx bx-network-chart text-xl mr-2"></i> Announcements
          </Link>
        ) : (
          <Link
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 flex items-center"
            to="applications"
          >
            <i className="bx bxs-color text-xl mr-2"></i> Your Applications
          </Link>
        )}
      </div>
    </div>
  );
}

export default Jobs;
