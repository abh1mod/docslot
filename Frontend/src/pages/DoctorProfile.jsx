import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowAltCircleDown, FaArrowCircleUp } from "react-icons/fa";
import { useAuth } from "../ContextAPI/AuthContext";
import LoginDoc from "./LoginPages/LoginDoc";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import RemoveIcon from "../assets/remove.png";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

function ConfirmDelete({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-[400px] md:min-h-[280px] bg-white rounded-md p-6 shadow-lg text-center ">
        <img src={RemoveIcon} alt="Remove Icon" className="w-20 h-20 mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-2">Are you sure?</h2>
        <p className="mb-4 text-gray-600">Do you really want to reject this appointment?</p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Reject
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function DoctorProfile() {
  const { user, isLogin, setIsLogin } = useAuth();
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);

  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState({});
  const [aptToReject, setAptToReject] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [upcomingOpen, setUpcomingOpen] = useState(true);
  const [pastOpen, setPastOpen] = useState(false);

  // Load appointments for this doctor
  const loadAppointments = async () => {
    if (!user?.doc_id) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/my_day/${user?.doc_id}`);
      if (res.data.success) {
        setAppointments(res.data.data || []);
      } else {
        console.error("Error loading appointments:", res.data);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [user?.doc_id]);

  // Load doctor profile
  const loadDoctor = async () => {
    if (!user?.doc_id) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/doc_profile/${user?.doc_id}`);
      if (res.data.success) {
        setDoctor(res.data.data);
      } else {
        console.error("Error loading doctor:", res.data);
      }
    } catch (err) {
      console.error("Error fetching doctor:", err);
    }
  };

  useEffect(() => {
    loadDoctor();
  }, [user?.doc_id, isLogin]);

  const upcomingAppointments = appointments.filter((a) => (a.date || "").slice(0, 10) >= today);
  const countToday = upcomingAppointments.filter((a) => (a.date || "").slice(0, 10) === today && a.status === "Confirmed");

  const pastAppointments = appointments.filter((a) => (a.date || "").slice(0, 10) < today);

  function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  }
  function formatTime(timeStr) {
    if (!timeStr) return "";
    // handle "HH:MM:SS" or "HH:MM"
    return timeStr.slice(0, 5);
  }

  const handleAptReject = async (apt_id) => {
    try {
      const res = await axios.patch(`${BASE_URL}/api/doctor/reject_apt/${apt_id}`);
      if (res.data.success) {
        toast.success("Appointment Rejected Successfully!", { autoClose: 2000 });
        setShowConfirmation(false);
        setAptToReject(null);
        await loadAppointments();
      } else {
        toast.error("Error while rejecting appointment!", { autoClose: 2000 });
      }
    } catch (error) {
      console.error("Reject error:", error);
      toast.error("Error while action!", { autoClose: 2000 });
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/doctor/logout`);
      if (res.data.success) {
        toast.success("Logout Successfully!", { autoClose: 2000 });
        setIsLogin(false);
        navigate("/doc_home");
      } else {
        toast.error("Error while Logout!", { autoClose: 2000 });
      }
    } catch (error) {
      toast.error("Error while Action!", { autoClose: 2000 });
    }
  };

      function manageTime(time) {
        let hour = time.slice(0,2);
        let period = hour >= 12 ? 'PM' : 'AM';
        hour = hour > 12 ? hour - 12 : hour;
        return `${hour.toString().padStart(2, '0')}:00 ${period}`;
    }


  if (!isLogin) return <LoginDoc />;

  return (
    <>
      <div className="bg-gray-100 p-4 min-h-screen">
        <div className="max-w-5xl min-h-[83vh] mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left: Profile */}
            <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200 p-6 flex flex-col items-center">
              <img
                src={doctor?.image || user?.image || "https://res.cloudinary.com/dahtedx9c/image/upload/v1753246193/doctor_images/iurgcqfmt9xsydjrpbho.png"}
                alt="Doctor profile"
                className="rounded-full w-36 h-36 object-cover mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800 text-center">{doctor?.name || user?.name}</h2>
              <p className="text-gray-600 text-center">{doctor?.specialization || user?.specialization}</p>

              <div className="mt-4 text-sm text-gray-600 space-y-2 text-center w-full">
                <p>☎︎ {doctor?.phone || user?.phone}</p>
                <p className="break-words">📧 {doctor?.email || user?.email}</p>
                <p>{doctor?.city || "—"}</p>
              </div>

              <div className="mt-6 w-full flex flex-col items-center gap-3">
                <button
                  onClick={() => navigate(`/edit_doc/${user?.doc_id}`)}
                  className="max-w-xs w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Manage Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="max-w-xs w-full bg-gray-200 py-2 rounded-md hover:bg-gray-300"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Right: Dashboard & Appointments */}
            <div className="md:flex-1 p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
                <div className="hidden md:flex gap-4">
                  <div className="bg-blue-500 text-white rounded-lg px-4 py-3 flex flex-col items-center justify-center">
                    <span className="text-sm">Appointments Today</span>
                    <span className="text-2xl font-bold">{countToday.length}</span>
                  </div>
                </div>
              </div>

              {/* Small stat cards for mobile */}
              <div className="flex justify-center gap-4 mb-6 md:hidden w-full">
              <div className="bg-blue-500 text-white rounded-lg px-4 py-3 text-center w-[60%] sm:w-[45%] md:w-[30%]">
                <div className="text-sm">Appointments Today</div>
                <div className="text-xl font-bold">{countToday.length}</div>
              </div>
            </div>


              {/* Upcoming Accordion */}
              <div className="mb-6">
                <button
                  onClick={() => setUpcomingOpen((v) => !v)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">Upcoming Appointments</span>
                    <span className="text-sm text-gray-500">({upcomingAppointments.length})</span>
                  </div>

                  <div
                    title="refresh"
                    onClick={(e) => {
                      e.stopPropagation();   
                      loadAppointments();
                    }}
                    className="p-1 rounded hover:bg-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {/* Simple reload icon using SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4v5h.582M20 20v-5h-.581M5.11 9a7 7 0 0113.78 0M19.41 15a7 7 0 01-13.78 0"
                      />
                    </svg>
                  </div>
                </div>
                  {upcomingOpen ? <FaArrowCircleUp /> : <FaArrowAltCircleDown />}
                </button>

                <div className={`mt-3 transition-all ${upcomingOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                  <div className="flex flex-col gap-3">
                    {upcomingAppointments.length === 0 && <div className="text-gray-600 p-3">No upcoming appointments.</div>}
                    {upcomingAppointments.map((item) => {
                      const statusClass = item.status === "Confirmed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
                      return (
                        <div key={item.apt_id} className="bg-white rounded-lg p-4 shadow-sm flex items-start justify-between gap-4">
                          {/* Left column: name, date/time/type, report */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{item.name || "N/A"}</p>

                            <div className="mt-1 text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center sm:gap-3">
                              <span>{formatDate(item.date)}</span>
                              <span>•</span>
                              <span>{item.start_time && manageTime(item.start_time)}</span>
                              <span className="hidden sm:inline">•</span>
                              <span className="text-gray-500">{item.category || "Consultation"}</span>
                            </div>

                            {item.report && (
                              <div className="mt-2">
                                <a href={item.report} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                                  View Report
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Right column: status + actions */}
                          <div className="flex flex-col items-end gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}>
                              {item.status}
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                disabled={item.status === "Rejected"}
                                onClick={() => {
                                  setAptToReject(item.apt_id);
                                  setShowConfirmation(true);
                                }}
                                title="Reject Appointment"
                                className="text-red-600 font-semibold disabled:opacity-60"
                              >
                                ✖
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Past Accordion */}
              <div className="mb-6">
                <button
                  onClick={() => setPastOpen((v) => !v)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">Past Appointments</span>
                    <span className="text-sm text-gray-500">({pastAppointments.length})</span>
                  </div>
                  {pastOpen ? <FaArrowCircleUp /> : <FaArrowAltCircleDown />}
                </button>

                <div className={`mt-3 transition-all ${pastOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                  <div className="flex flex-col gap-3">
                    {pastAppointments.length === 0 && <div className="text-gray-600 p-3">No past appointments.</div>}
                    {pastAppointments.map((item) => (
                      <div key={item.apt_id} className="bg-white rounded-lg p-4 shadow-sm flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{item.name || "N/A"}</p>
                          <div className="mt-1 text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center sm:gap-3">
                            <span>{formatDate(item.date)}</span>
                            <span>•</span>
                            <span>{item.start_time && formatTime(item.start_time)}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="text-gray-500">{item.type || item.appointment_type || "Consultation"}</span>
                          </div>
                          {item.report && (
                            <div className="mt-2">
                              <a href={item.report} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                                View Report
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                            {item.status || "—"}
                          </span>
                          
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <ConfirmDelete
          onConfirm={() => handleAptReject(aptToReject)}
          onCancel={() => {
            setShowConfirmation(false);
            setAptToReject(null);
          }}
        />
      )}
    </>
  );
}

export default DoctorProfile;
