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

    const [slotList, setSlotList] = useState([]);
    const [freeSlots, setFreeSlots] = useState([]);
    const [busy_slots, setBusySlots] = useState([]);
    const [duration, setDuration] = useState("10-18");

    const [start_time, setStartTime] = useState("");
    const [date, setDate] = useState("");
    const [remarks, setRemarks] = useState("No Remarks");
    const [category, setCategory] = useState("");
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

    useEffect(()=>{
      const fetchDuration = async()=>{
        try{
          const res = await axios.get(`${BASE_URL}/api/patient/slot_duration/${doc_id}`);
            if(res.data.success){
              console.log(res.data.data.slot)
              setDuration(res.data.data.slot);
            }
        }
        catch(error){
          console.log("Error in fetching duration",error);
        }
      } 
      fetchDuration();
    },[doc_id])


useEffect(() => {
    if (!date) return;
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10); 
    const currentTime = now.toTimeString().slice(0, 5); 

    const busySlotList = busy_slots.map(slot => slot.start_time.slice(0, -3));

    const filteredSlots = slotList.filter(slot => {
        if (busySlotList.includes(slot)) return false;
        if (date === todayStr && slot < currentTime) return false;
        return true;
    });
    setFreeSlots(filteredSlots);
}, [busy_slots, date, slotList]);



    useEffect(()=>{
      if(duration === null) return;
      const createSlotList = ()=>{
          let start_hour = duration.slice(0,2);
          let end_hour = duration.slice(-2);
          const temp = [];
          for(var i = parseInt(start_hour); i<= parseInt(end_hour); i++){
            temp.push(((i<10) ? " " : "") + i.toString() + ":00");
          }
          console.log(temp);
        setSlotList(temp);
      }
      createSlotList();
    },[duration]);


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
            const res = await axios.post(`${BASE_URL}/api/book_appointment/${doc_id}/${user.pt_id}`, {start_time,date,remarks,category});
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

     function manageTime(time) {
        let hour = time.slice(0,2);
        let period = hour >= 12 ? 'PM' : 'AM';
        hour = hour > 12 ? hour - 12 : hour;
        return `${hour.toString().padStart(2, '0')}:00 ${period}`;
    }

    
    if(!isLogin) {
      return <LoginPt />;
    }
  return (

    
  <div className="flex flex-col items-center justify-center min-h-[90vh] bg-gray-100 px-0">
    <div className="flex flex-col lg:gap-18 lg:p-10 md:flex-row gap-2 justify-center  bg-white shadow-md rounded-lg p-6 lg:w-[60%] sm:w-[75%] w-[95%] min-h-[550px]">

      {/* Doc Profile Card — Hidden on small screens */}
      {/* <div className="hidden md:block bg-white w-full md:w-[260px]"> */}
         <div className="w-full lg:w-[60%]">
          <DocProfileCard events={doctor} />
        </div>
      {/* </div> */}

      {/* Form Section */}
      <div className="bg-white w-full p-0 sm:p-3">
        <form onSubmit={handleBooking}>
          {/* Name */}
          <label className="block mb-2 text-l font-medium text-gray-700">Enter Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="Enter your name"
            defaultValue={user?.name}
            maxLength={25}
            required
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
                required
                min = {new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-l font-medium text-gray-700">Select Slot</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md mb-4 p-2.5"
                name="slot"
                onChange={(e) => setStartTime(e.target.value)}
                disabled={!date}
                required
              >
                <option value="">Select Slot</option>
                {freeSlots.map((slot, index) => (
                  <option key={index} value={slot}>
                    {manageTime(slot)}
                </option>
                ))}
              </select>
            </div>
          </div>

       
          <label className="block mb-2 text-l font-medium text-gray-700">Appointment Category</label>
          <select
                className="w-full p-2 border border-gray-300 rounded-md mb-4 p-2.5"
                name=""
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {["Consultation","Routine Checkup","Follow-up Visit","Annual Physical","Others"].map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>

          {/* Remarks */}
          <label className="block mb-2 text-l font-medium text-gray-700">Remarks</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="Enter any remarks or additional information"
            rows="4"
            name="remarks"
            onChange={(e) => setRemarks(e.target.value)}
            required
            maxLength={50}
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
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