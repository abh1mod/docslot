import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../ContextAPI/AuthContext';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

function PtProfileEdit({pt_profile, setIsEditing, fetchUser}) {
    const {isLogin, setIsLogin} = useAuth();
    const [pt_name, setPtName] = useState(pt_profile.name);
    const [gender, setGender] = useState(pt_profile.gender);
    const [dob, setDob] = useState(pt_profile.dob);
    const [phone, setPhone] = useState(pt_profile.phone);
    const [email, setEmail] = useState(pt_profile.email);
    const pt_id = pt_profile.pt_id;
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault(); 
        console.log("Profile Details", pt_name, gender, dob, phone, email);
        try {
            const res = await axios.put(`${BASE_URL}/api/pt_update/${pt_id}`, {pt_name,gender,dob,phone,email});
            if(res.data.success){
                fetchUser();  
                setIsEditing(false);
                toast.success(
                    "Profile Updated successfully!",
                    {
                      autoClose: 2000,
                     hideProgressBar: false,
                     closeOnClick: true,
                     pauseOnHover: true,
                      draggable: true,
                })
            }
        } catch(error) {
              toast.error("Profile Updated failed!",{
                autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,
                })
        }
    }
        const handleLogout = async() =>{
        try{
            const res = await axios.post(`${BASE_URL}/api/patient/logout`);
            if(res.data.success){
                // Put line before Please Login Again
                 toast.success( <>
                    Profile Updated successfully! <br /> Please login again.
                </>,{
                  autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,

                })
                navigate("/home");
                // window.location.reload(true);
            }else{
               toast.error("Profile Updation failed!",{
                  autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,

                })
            }
        }catch(error){
             toast.error("Error While action!",{
                  autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,

                })
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
  <div className="flex flex-col w-full max-w-lg bg-white rounded-md p-8 shadow-sm  items-center">
    {/* Header */}
    <div className="flex items-center justify-between w-full mb-1 relative">
      <h1 className="mx-auto text-xl font-bold">Manage Your Profile</h1>
      <button
        onClick={() => setIsEditing(false)}
        className="absolute right-0 text-xl font-bold"
      >
        ×
      </button>
    </div>

    {/* Form */}
    <div className="flex flex-col items-start justify-center gap-4 mt-4 w-full">
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        {/* Name */}
        <label className="text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter your name"
          defaultValue={pt_profile.name}
          maxLength={25}
          onChange={(e) => setPtName(e.target.value)}
        />

        {/* Date of Birth & Gender */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md"
              defaultValue={pt_profile.dob ? pt_profile.dob.split('T')[0] : ''}
              max={new Date().toISOString().split("T")[0]} // Set max value to today
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">Gender</label>
            <input
              type="text"
              placeholder="Enter Your Gender"
              maxLength={6}
              disabled = {pt_profile.gender}
              defaultValue={pt_profile.gender}
              className="w-full p-2 border border-gray-300 rounded-md"
              onChange={(e) => setGender(e.target.value)}
            />
          </div>
        </div>

        {/* Phone */}
        <label className="text-sm font-medium text-gray-700">Contact Number</label>
        <input
          type="text"
          placeholder="Contact Number"
          defaultValue={pt_profile.phone}
          pattern="[0-9]{10}"
          maxLength={10}
          className="w-full p-2 border border-gray-300 rounded-md"
          onChange={(e) => setPhone(e.target.value)}
        />

        {/* Email */}
        <label className="text-sm font-medium text-gray-700">Email Id</label>
        <input
          type="email"
          placeholder="Email Id"
          defaultValue={pt_profile.email}
          disabled
          className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Submit */}
        <button
          className="w-full mt-4 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
          type="submit"
        >
          Update Details
        </button>
      </form>
    </div>
  </div>
</div>

    )
}

export default PtProfileEdit;