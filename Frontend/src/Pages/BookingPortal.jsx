import DocProfileCard from "./DocProfileCard.jsx";
import { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./LoginPages/Registration.css";
import { Link } from "react-router-dom";
import LoginPt from "./LoginPages/LoginPt.jsx";
import RegistrationPt from "./LoginPages/RegistrationPt.jsx";
import { useAuth } from "../ContextAPI/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

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
                const res = await axios.get(`http://localhost:3000/api/busy_slots/${date}/${doc_id}`);
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
                const res = await axios.get(`http://localhost:3000/api/doc_profile/${doc_id}`);
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
            const res = await axios.post(`http://localhost:3000/api/book_appointment/${doc_id}/${user.pt_id}`, {start_time,date,remarks});
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
    <div> 
    
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-gray-100">
      <div className="flex gap-4 bg-white shadow-md rounded-lg p-8 min-w-[830px] max-w-md  min-h-[550px]">
        
        <div className="bg-white min-w-[260px] min-h-full">
            <DocProfileCard events = {doctor}/>
        </div>
        <hr/>
        <div className="bg-white min-w-[490px] min-h-full p-3">
            <form>
                <label className="block mb-2 text-l font-medium text-gray-700">Enter Name</label>
                <input
                    type="text"
                    className="w-[400px] p-2 border border-gray-300 rounded-md mb-4"
                    placeholder="Enter your name" 
                    defaultValue={user?.name}
                    disabled 
                />
                
                <div flex className="flex gap-10">
                    <div>
                        <label className="block mb-2 text-l font-medium text-gray-700">Select Date</label>
                        <input
                        type="date"
                        className="w-[180px] p-2 border border-gray-300 rounded-md mb-4"
                        name="date"
                        onChange={(e)=>setDate(e.target.value)}
                    />
                    </div>
                    <div>
                        <label className="block mb-2 text-l font-medium text-gray-700">Select Slot</label>
                    <select className="w-[180px] p-2 border border-gray-300 rounded-md mb-4"
                    name="slot"
                    onChange={(e)=>setStartTime(e.target.value)}
                    disabled = {!date} >
                        <option value="">Select Slot</option>
                        {freeSlots.map((slot,index) => <option value={slot}>{slot}</option>)}                           
                        </select>

                    </div> 
                </div>
                <label className="block mb-2 text-l font-medium text-gray-700">Contact Number</label>
                <input
                    type="text"
                    className="w-[400px] p-2 border border-gray-300 rounded-md mb-4"
                    placeholder="Enter your Contact Number"   
                    defaultValue={user?.phone}
                    disabled
                />
                <label className="block mb-2 text-l font-medium text-gray-700">Remarks</label>
                <textarea
                    className="w-[400px] p-2 border border-gray-300 rounded-md mb-4"
                    placeholder="Enter any remarks or additional information"
                    rows="4"    
                    name="remarks"
                    onChange={(e)=>setRemarks(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-[400px] bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
                    onClick={handleBooking}
                >
                    Book Appointment
                </button>
                    
                
            </form>
        </div>
      </div>
    </div>
    </div>
  );
}


export default BookingPortal;