import { useEffect, useState, useContext } from "react";
import { useAuth, AuthContext } from "../ContextAPI/AuthContext";
import { useNavigate } from "react-router-dom";
import upload from "../../src/assets/upload.png";
import axios from "axios";
import PtProfileEdit from "./PtProfileEdit";
import RemoveIcon from "../assets/remove.png";
import LoginPt from "./LoginPages/LoginPt";
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

function ConfirmDelete({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
      <div>
        <div className="flex flex-col min-h-[300px] min-w-[360px] bg-white rounded-md p-6 shadow-sm text-center items-center justify-center">
          <img src={RemoveIcon} alt="Remove Icon" className="w-20 h-23 mb-4" />
          <h2 className="text-lg font-semibold mb-2">Are you sure?</h2>
          <p className="mb-4">Do You really want to delete this appointment?</p>
          <div className="flex items-center justify-center w-full mb-1 mt-3 relative gap-5">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={onConfirm}
            >
              Delete
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PtProfile() {
  const { role, setIsLogin, setUser } = useContext(AuthContext);
  const {user,isLogin,fetchUser} = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [slot, setSlot] = useState([]);
  const [deleteId, setDeleteId] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [slotSize, setSlotSize] = useState(1);
  const [uploadedReport, setUploadedReport] = useState(null);
  const navigate = useNavigate();

  const fetchSlot = async () => {
    if (!user?.pt_id) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/pt_slot/${user?.pt_id}`);
      if (res.data.success) {
        setSlot(res.data.data);
        setSlotSize(res.data.data.length);
      }
    } catch (error) {
      alert(error.response.data.message);
      console.log("Error from catch Block", error);
    }
  };

  useEffect(() => {
    if (!isLogin) return;
    if (user?.pt_id) fetchSlot();
  }, [user, isLogin]);

  const handleAptDelete = async (apt_id) => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/delete_apt/${apt_id}`);
      if (res.data.success) {
        toast.success("Appointment deleted Successfully!", { autoClose: 2000 });
        fetchSlot();
      } else {
        toast.error("Appointment deletion failed!", { autoClose: 2000 });
      }
    } catch (error) {
      toast.error("Error While Action!", { autoClose: 2000 });
    }
  };


  const handleReportUpload = async (file, apt_id) => {
    if (!file || !apt_id) {
      console.error("File missing");
      return;
    }
    const formData = new FormData();
    formData.append("photo", file); 
    try {
      const response = await axios.post(`${BASE_URL}/api/patient/upload_report/${apt_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        console.log("Upload success:", response.data.data);
        toast.success("Report uploaded successfully!", { autoClose: 2000 });
        fetchSlot(); 
      } else {
        console.error("Upload failed:", response.data.message);
      }
    } catch (error) {
      toast.error(`${error.response.data.message}`, { autoClose: 2000 });
    }
  };

  function manageTime(time) {
    let hour = time.slice(0, 2);
    let period = hour >= 12 ? "PM" : "AM";
    hour = hour > 12 ? hour - 12 : hour;
    return `${hour.toString().padStart(2, "0")}:00 ${period}`;
  }

  function manageDate(dateStr) {
    const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let year = dateStr.slice(0, 4);
    let month = dateStr.slice(5, 7);
    let date = dateStr.slice(-2);
    let i = parseInt(month) - 1;
    return parseInt(date) + ", " + monthArr[i] + " " + year;
  }

  if (!isLogin) return <LoginPt />;

  return (
    <div className="flex flex-col items-center  min-h-[90vh] bg-gray-100 p-4">
      <div className="flex flex-col min-h-[80vh] bg-white shadow-md rounded-lg md:p-10 sm:p-6 p-3 lg:w-[70%] md:w-[75%] sm:w-[85%] w-[100%]">
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b pb-4 mb-4">
          <div className="flex items-center gap-4">
            <img
              src="https://media.lordicon.com/icons/wired/gradient/17-avatar-man-nodding.gif"
              alt="Profile"
              className="w-24 h-24 rounded-full hidden md:block"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {"Profile"}
                <button onClick={() => setIsEditing(true)} className="font-medium text-sm text-blue-600">
                  🔗 Edit
                </button>
              </h1>
              <p className="text-lg font-semibold text-gray-800">👤 {user?.name}</p>
              <p className="text-gray-600">☎︎ {user?.phone}</p>
              {/* break email in two and bring in next line*/}
              <p className="text-gray-600 word-break">📧 {user?.email}</p>
              {isEditing && <PtProfileEdit pt_profile={user} setIsEditing={setIsEditing} fetchUser={fetchUser} />}
            </div>
          </div>
        </div>

        {/* Appointments */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2 p-2">Scheduled Appointments</h1>
        {slotSize === 0 && <p className="text-gray-600">No Appointments Scheduled</p>}

        <div className="flex flex-col gap-4">
          {slot.map((obj) => (
            <div
              key={obj.apt_id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between border rounded-lg p-4 shadow-sm hover:shadow-md"
            >
              {/* Left Section */}
              <div>
              <div>
  <div className="flex flex-row items-center">
    <p className="font-medium text-gray-900">Dr {obj.name}</p>

    <label className="cursor-pointer ml-3 text-blue-600 underline flex items-center">
      <img
        src={upload}
        alt="Upload"
        title="Upload Report"
        className="inline-block mr-1 h-[1rem]"
      />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleReportUpload(e.target.files[0], obj.apt_id)}
      />
      {obj.report && (
  <a
    href={obj.report}
    target="_blank"
    rel="noopener noreferrer"
    className="ml-1 text-sm text-green-600 font-normal hover:text-blue-800 transition-colors duration-200"
  >
    Uploaded Report
  </a>
)}

    </label>
  </div>
</div>

                
                <p className="text-sm text-gray-600">
                  {manageDate(obj.date.slice(0, 10))} • {obj.start_time && manageTime(obj.start_time.slice(0, 5))}
                 
                

                </p>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-6 mt-2 sm:mt-0">
              {/* Upload Report */}
                
                <p
                  className={`font-semibold ${
                    obj.status === "Confirmed" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {obj.status}
                </p>

                

                {/* Delete Button */}
                <button
                  className="font-medium text-red-700 hover:underline disabled:opacity-50"
                  title="Delete Appointment"
                  disabled={obj.status === "Rejected" || obj.status === "Cancelled"}
                  onClick={() => {
                    setShowConfirmation(true);
                    setDeleteId(obj.apt_id);
                  }}
                >
                  ✖
                </button>
              </div>

              {/* Confirmation Modal */}
              {showConfirmation && (
                <ConfirmDelete
                  onConfirm={() => {
                    handleAptDelete(deleteId);
                    setShowConfirmation(false);
                    setDeleteId(null);
                  }}
                  onCancel={() => {
                    setShowConfirmation(false);
                    setDeleteId(null);
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PtProfile;
