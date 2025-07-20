import axios from "axios";
import { useAuth } from "../ContextAPI/AuthContext";
import { useState, useEffect, use } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

const EditDocProfile = () => {
  const allTimes = Array.from({ length: 12 }, (_, i) => 8 + i); 
  const [endTimeOption, setEndTimeOption] = useState([]);
  const {user,isLogin,setIsLogin} = useAuth();
  const doc_id = user?.doc_id;
  const [photo, setPhoto] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [formData, setFormData] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        specialization: user.specialization || "",
        phone: user.phone || "",
        email: user.email || "",
        address: user.address || "",
        city: user.city || "",
        about: user.about_us || "",
        slot: user.slot || ""
    });
    setSlotTime(user.slot || "");
    setPhoto(user.image || "");
    }
  }, [user]);

  useEffect(()=>{
    formData.slot = `${startTime}-${endTime}`;
  },[startTime, endTime]);

  // useEffect(()=>{
  //   console.log(slotTime);
  // },[slotTime])

  const handleChange = (e)=>{
    const {name, value} = e.target;
    setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
  console.log(value);
  }
    
  const handlePhotoUpload = async (file) => {
    if (!file) {
      console.error("File missing");
      return;
    }
    const formData = new FormData();
    formData.append("photo", file); 
    try {
      const response = await axios.post(`${BASE_URL}/api/doctor/upload_image/${doc_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        console.log("Upload success:", response.data.data);
        setPhoto(response.data.data); 
      } else {
        console.error("Upload failed:", response.data.message);
      }
    } catch (error) {
      console.error("Upload error:", error.message);
    }
  };

  const handleUpdateProfile = async(event)=>{
    event.preventDefault();
    if(!user) return;
    try{
      const res = await axios.put(`${BASE_URL}/api/doctor/update/${user.doc_id}`,{formData:formData});
      if(res.data.success){
        console.log("Profile Updated Successfully",res.data);
        alert(res.data.message);
        handleLogout();
      }
    }catch(error){
      console.log(error);
    }
    
  }
  const handleLogout = async() =>{
          try{
              const res = await axios.post(`${BASE_URL}/api/doctor/logout`);
              if(res.data.success){
                  alert("Please Login Again")
                  setIsLogin(false);
                  navigate("/doc_home");
              }else{
                   alert("Error while logging out")
              }
          }catch(error){
              alert("Error from catch block")
          }
      }
  const getMaxLength = (field) => {
      switch (field) {
        case "Name":
          return 30;
        case "Specialization":
          return 30;
        case "Phone":
          return 10;
        case "Email":
          return 40;
        case "Address":
          return 40;
        case "City":
          return 20;
        default:
          return 20;
  }
};
  return (
    <div className="flex items-center justify-center pt-4 pb-4 m-0 bg-gray-100 w-screen">
      <div className="w-full lg:w-4/6 mx-auto bg-white md:p-6 p-2 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2 mt-3 text-center">UPDATE PROFILE</h2>
        <form onSubmit={handleUpdateProfile}>
          <div className="flex flex-col md:flex-row">
            {/* Left Column */}
            <div className="md:w-full p-2">
              {["Name", "Specialization", "Phone", "Email", "Address", "City"].map((field) => (
                <div className="p-2" key={field}>
                  <label className="block text-sm font-medium mb-1">{field}</label>
                  <input
                    name={field.toLocaleLowerCase()}
                    value={formData[field.toLocaleLowerCase()] || ""}
                    maxLength={getMaxLength(field)}
                    onChange={handleChange}
                    disabled={field === "Email"}
                    required
                    type="text"
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="md:w-full p-2">
              <div className="p-2 flex flex-col ">
              <div>
                <label className="block text-sm font-medium mb-1">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="pt-2 pb-2 w-full rounded"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    handlePhotoUpload(file);
                  }}
                />
              </div>
                
              {photo!="" && (
                <div className="mb-4">
                  <img src={photo} alt="Profile" className="w-42 h-32 rounded-md object-cover border " />
                </div>
              )}
              </div>

              <div className="p-2">
                <label className="block text-sm font-medium mb-1">About</label>
                <textarea className="border border-gray-300 p-2 w-full rounded " 
                    value={formData.about}
                    name="about"
                    rows={4}
                    onChange={handleChange}
                    required
                    maxLength={200}
                />
              </div>

              <div className="flex flex-row">
                <div className="w-1/2 p-2">
                  <label className="block text-sm font-medium mb-1">Available From</label>
                  <select
                    className="border border-gray-300 p-2 w-full rounded"
                    required
                    onChange={(e) => {
                      const selectedTime = parseInt(e.target.value);
                      const filtered = allTimes.filter((time) => time >= selectedTime);
                      setEndTimeOption(filtered);
                      setStartTime(e.target.value);
                      if(parseInt(e.target.value)>parseInt(endTime)) setEndTime("");
                    }}
                    // value={parseInt(formData.slot.slice(0, 2))}
                  >
                    <option value="">First Slot</option>
                    {allTimes.map((time) => (
                      <option key={time} value={time}>
                        {time <= 12 ? time : time - 12}:00 {time < 12 ? "AM" : "PM"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-1/2 p-2">
                  <label className="block text-sm font-medium mb-1">Available Until</label>
                  <select
                    required
                    className="border border-gray-300 p-2 w-full rounded"
                    disabled={!endTimeOption.length}
                    // value={parseInt(formData.slot.slice(-2))}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                    }}
                  >
                    <option value="">Last Slot</option>
                    {endTimeOption.map((time) => (
                      <option key={time} value={time}>
                        {time <= 12 ? time : time - 12}:00 {time < 12 ? "AM" : "PM"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
          <div className="w-full ml-4 mr-4 md:w-1/2">
            <button
              // onClick={handleUpdateProfile}
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 mb-5 rounded hover:bg-blue-600 w-full"
            >
              Update Profile
            </button>
          </div>
        </div>
        </form>

        {/* Submit Button */}
        
      </div>
    </div>
  );
};

export default EditDocProfile;
