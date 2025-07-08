import DocProfileCard from "./DocProfileCard.jsx";
import { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./LoginPages/Registration.css";
import { Link } from "react-router-dom";
import LoginPt from "./LoginPages/LoginPt.jsx";
// import RegistrationPt from "./LoginPages/RegistrationPt.jsx";
import { useAuth } from "../ContextAPI/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

function BookingPortal() {
    const { doc_id } = useParams();
    const [doctor, fetchDoctor] = useState({});
    const [aptDetails, setAppointment] = useState({});
    const [isRegistered, setIsRegistered] = useState(true);
    const [busy_slots, setBusySlots] = useState([]);
    const [freeSlots, setFreeSlots] = useState([]);
    const [start_time, setStartTime] = useState("");
    const [date, setDate] = useState("");
    const [remarks, setRemarks] = useState("No Remarks");
    const {fetchUser, isLogin, user} = useAuth();

    const navigate = useNavigate();
    //slot update as soon as date changes
    useEffect(()=>{
        const fetchSlot = async()=>{
            try{
                if (!date) return;
                console.log(aptDetails.date)
                const res = await axios.get(`${BASE_URL}/api/busy_slots/${date}/${doc_id}`);
                if(res.data.success){
                    setBusySlots(res.data.data);
                }
            }catch(error){
                console.log("Error From Catch Block",error);
            }
        }
        fetchSlot()
    },[date]);


    const slotList = ["10:00","11:00","12:00","13:00","16:00","17:00","18:00"];
    useEffect(() => {
        if(!date) return;
        const busySlotList = busy_slots.map(slot => slot.start_time.slice(0,-3)); 
        setFreeSlots( slotList.filter(slot => !busySlotList.includes(slot)));
        
    }, [busy_slots]);

    useEffect(()=>{
        const fetchProfile = async()=>{
            try{
                const res = await axios.get(`${BASE_URL}/api/doc_profile/${doc_id}`);
                if(res.data.success){
                    fetchDoctor(res.data.data);
                }
                else{
                    console.log("Error in Fetching Profile");
                }
            }
            catch(error){
                console.log("Error from catch Block",error);
            }
        }
        fetchProfile();
    }, [])
    
    const handleBooking = async (event) => {
        event.preventDefault();
        try{
            console.log(start_time, date);
            const res = await axios.post(`${BASE_URL}/api/book_appointment/${doc_id}/${user.pt_id}`, {start_time,date,remarks});
            if(res.data.success){
                 toast.success("Booking Successfully!",{
                  autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,

                })
                navigate("/pt_profile");
            }
            else {
                 toast.error("Error while booking!",{
                  autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,

                })
            }
        }
        catch(error){
            toast.error("Error while action!",{
                  autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,

                })
        }
    }

    

  return (

    
  <div className="flex flex-col items-center justify-center min-h-[90vh] bg-gray-100 px-2">
    <div className="flex flex-col md:flex-row gap-4 bg-white shadow-md rounded-lg p-6 md:p-8 w-full max-w-4xl min-h-[550px]">

      {/* Doc Profile Card — Hidden on small screens */}
      {/* <div className="hidden md:block bg-white w-full md:w-[260px]"> */}
         <div className="w-full md:w-[260px]">
          <DocProfileCard events={doctor} />
        </div>
      {/* </div> */}

      {/* Form Section */}
      <div className="bg-white w-full md:w-[490px] p-2 sm:p-3">
        <form>
          {/* Name */}
          <label className="block mb-2 text-l font-medium text-gray-700">Enter Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="Enter your name"
            defaultValue={user?.name}
            disabled
          />

          {/* Date & Slot */}
          <div className="flex flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-2 text-l font-medium text-gray-700">Select Date</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                name="date"
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-l font-medium text-gray-700">Select Slot</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md mb-4 p-2.5"
                name="slot"
                onChange={(e) => setStartTime(e.target.value)}
                disabled={!date}
              >
                <option value="">Select Slot</option>
                {freeSlots.map((slot, index) => (
                  <option key={index} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Number */}
          <label className="block mb-2 text-l font-medium text-gray-700">Contact Number</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="Enter your Contact Number"
            defaultValue={user?.phone}
            disabled
          />

          {/* Remarks */}
          <label className="block mb-2 text-l font-medium text-gray-700">Remarks</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="Enter any remarks or additional information"
            rows="4"
            name="remarks"
            onChange={(e) => setRemarks(e.target.value)}
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
            onClick={handleBooking}
          >
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  </div>
);
}


export default BookingPortal;