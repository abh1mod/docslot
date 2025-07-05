import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function PtProfileEdit({pt_profile, setIsEditing}) {
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
            const res = await axios.put(`http://localhost:3000/api/pt_update/${pt_id}`, {pt_name,gender,dob,phone,email});
            if(res.data.success){
                //  toast.success("Profile Updated Successfully!",{
                //   autoClose: 2000,
                //  hideProgressBar: false,
                //  closeOnClick: true,
                //  pauseOnHover: true,
                //  draggable: true,

                // })
                setIsEditing(false);
                handleLogout();
            }
        } catch (error) {
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
            const res = await axios.post("http://localhost:3000/api/patient/logout");
            if(res.data.success){
                 toast.success("Profile Updated successfully!",{
                  autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,

                })
                navigate("/");
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" >
            <div className="flex flex-col min-h-[400px] min-w-[420px] bg-white rounded-md p-4 shadow-sm  text-center items-center">
            <div className="flex items-center justify-between w-full mb-1 relative">
                <h1 className="mx-auto text-xl font-bold">Manage Your Profile</h1>
                <button 
                    onClick={() => setIsEditing(false)} 
                    className="absolute right-0 text-xl font-bold">×
                </button>
            </div>

            <div className="flex flex-col items-start justify-center gap-4 mt-4 text-start">
                <form className="flex flex-col gap-0.5">
                <label className="block mb-1 text-sm font-small text-gray-700">Name</label>
                <input
                    type="text"
                    className="w-[355px] p-2 border border-gray-300 rounded-md mb-4"
                    placeholder="Enter your name" 
                    defaultValue={pt_profile.name}
                    onChange={(e) => setPtName(e.target.value)}
                />
                <div className="flex gap-4">
                    <div>
                    <label className="block mb-1 text-sm font-small text-gray-700">Date of Birth</label>
                     <input
                    type="date"
                    className="w-[170px] p-1.5 border border-gray-300 rounded-md mb-4"
                    defaultValue = {pt_profile.dob ? pt_profile.dob.split('T')[0] : ''}
                    onChange={(e) => setDob(e.target.value)}
                    />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-small text-gray-700">Gender</label>
                     <input
                    type="text"
                    placeholder="Enter Your Gender"
                    defaultValue={pt_profile.gender}
                    className="w-[170px] p-2 border border-gray-300 rounded-md mb-4"
                    onChange={(e) => setGender(e.target.value)}
                    />
                    </div>    
                </div>
                    <label className="block mb-1 text-sm text-gray-700">Contact Number</label>
                     <input
                    type="text"
                    placeholder="Contact Number"
                    defaultValue={pt_profile.phone}
                    className="w-[355px] p-2 border border-gray-300 rounded-md mb-4"
                    onChange={(e) => setPhone(e.target.value)}
                    />
                    <label className="block mb-1 text-sm text-gray-700">Email Id</label>
                     <input
                    type="email"
                    placeholder="Email Id"
                    defaultValue={pt_profile.email}
                    disabled
                    className="w-[355px] p-2 border border-gray-300 rounded-md mb-4"
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className="w-full bg-blue-600 text-white p-2 rounded-md mb-4 hover:bg-blue-700 transition duration-200"
                    
                    onClick={handleSubmit}>
                        Update Details
                    </button>
            </form>
            </div>
             </div>
        </div>
    )
}

export default PtProfileEdit;