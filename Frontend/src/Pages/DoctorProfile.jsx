import { useEffect ,useState} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowAltCircleDown } from "react-icons/fa"
import { FaArrowCircleUp } from "react-icons/fa";
import { useAuth } from "../ContextAPI/AuthContext";
import LoginDoc from "./LoginPages/LoginDoc";
import { useNavigate } from "react-router-dom";

function DoctorProfile(){
  const {user, isLogin} = useAuth();
  const navigate = useNavigate();
  //getting current date
  const today = new Date().toISOString().slice(0, 10); 



  // const{doc_id} = useParams();
  //logic for Accordion
  //for upcoming appointment
  const[isopen,setOpen]=useState(false);
  const[fetchdata,fetchData]=useState([])
  //for past appointment and we also use above useState
  const[open,setopen]=useState(false);

//use to fetch data form api for respective doc appointment
    useEffect(()=>{
        const fetchProfiledata = async()=>{
          if(!user?.doc_id) return;
            try{
              const res = await axios.get(`http://localhost:3000/api/my_day/${user?.doc_id}`);
              if(res.data.success){
                fetchData(res.data.data);
              }
              else{
                console.log("Error from try Block");
              }
            }catch(error){
              console.log("Error from catch Block");

            }
        }
        fetchProfiledata();
//rendering again when respective id data changes
    },[user?.doc_id]);

 console.log(fetchdata)
    const[doctor, setDoctor] = useState({});
    
    //fetch only doctor information
    useEffect(()=>{
        const fetchProfile = async()=>{
          if(!user?.doc_id) return;
            try{
              const res = await axios.get(`http://localhost:3000/api/doc_profile/${user?.doc_id}`);
              if(res.data.success){
                setDoctor(res.data.data);
              }
              else{
                console.log("Error from try Block");
              }
            }catch(error){
              console.log("Error from catch Block");

            }
        }
        fetchProfile();

    },[user?.doc_id, isLogin]);
  //  const{name,specialization,phone,email,id,image,about_us}=user;
   
   //filtering upcoming appointment form fetchdata
   const upcomingAppointments = fetchdata.filter((item) => {
   return item.date.slice(0, 10)>=today;
});

//filteing todays appointment
const count=upcomingAppointments.filter((item)=>{
  return item.date.slice(0,10)===today;
})

//filtering past appointment 
 const PastAppointments = fetchdata.filter((item) => {
  const appointmentDate = item.date.slice(0, 10);
  return appointmentDate < today;
});
    
    const handleLogout = async() =>{
        try{
            const res = await axios.post("http://localhost:3000/api/doctor/logout");
            if(res.data.success){
                alert(res.data.message);
                navigate("/");
                window.location.reload(true);
            }else{
                alert(res.data.message);
            }
        }catch(error){
            console.log(error);
        }
    }


  if(!isLogin) return <LoginDoc/>
//simple html+tailwind
    return <div className="bg-gray-100 min-h-screen flex flex-col items-center ">
  <div className="bg-white shadow-lg rounded-xl flex flex-col md:flex-row w-full max-w-4xl min-h-[520px] mt-5 ">
   
    <div className="p-6 md:w-1/3 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-200">
      <img src={user?.image} alt="Doctor profile" className="rounded-full w-[145px] h-[145px] object-cover mb-4 mt-6" />
      <h2 className="text-xl font-semibold text-gray-800">{user?.name}</h2>
      <p className="text-gray-600 mb-4">{user?.specialization}</p>
      <div className="text-gray-600 space-y-2 text-sm">
        <p><i className="fas fa-phone mr-2"></i>{user?.phone}</p>
        <p><i className="fas fa-envelope mr-2"></i>{user?.email}</p>
        <p><i className="fas fa-map-marker-alt mr-2"></i>Boston, MA</p>
      </div>
    </div>

 
    <div className="flex-1 p-6" >
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold mb-4 mt-4">Doctor Dashboard</h1>
       <button onClick={handleLogout} class="mr-4 rounded-md bg-blue-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-none active:bg-blue-700 hover:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" type="button">
                    Logout
            </button>
       </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-500 text-white rounded-lg flex flex-col items-center justify-center p-4">
          <p className="text-sm">Appointments Today</p>
          <p className="text-3xl font-bold">{count.length}</p>
        </div>
        <div className="bg-blue-500 text-white rounded-lg flex items-center justify-center p-4">
          <p>Manage schedule</p>
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg divide-y divide-gray-300">
        <div className="p-4 flex justify-between items-center">
          <span className="w-full">
            <div className="flex  justify-between transition-all duration-300 ease-in-out">
              <p>Upcoming Appointment</p>
            <button  onClick={()=>setOpen(isopen ? false : true)}>{isopen ? <FaArrowCircleUp /> : <FaArrowAltCircleDown />}</button>
            </div>
      <div
      //main upcoming appointement accordian

      //it can be implement in two ways here is one in backtick `` so that accordian can have 
      //transition be applied here on max-height class max-height apply on basis of isopen
  className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
    isopen ? 'max-h-96' : 'max-h-0'
  }`}>
  <div className="p-4 bg-gray-200">
    <table className="min-w-full text-left">
      <thead>
        <tr>
          <th className="px-2 py-1 border-2 border-black">Patient_name</th>
          <th className="px-2 py-1 border-2 border-black">Date</th>
          <th className="px-2 py-1 border-2 border-black">Time</th>
          {/* <th className="px-2 py-1 border-2 border-black">End_Time</th> */}
        </tr>
      </thead>
      <tbody>
      {/*showing rows using map function*/}
        {upcomingAppointments.map((item,index) => (
          <tr key={index}>
            <td className="px-2 py-1 border">{item.name}</td>
            <td className="px-2 py-1 border"> {item.date.substring(0, 10)}</td>
            <td className="px-2 py-1 border">{item.start_time.slice(0,5)}</td>
            {/* <td className="px-2 py-1 border">{item.end_time}</td> */}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

{/*same logic as upcoming appointment*/}
          </span>
          <i className="fas fa-chevron-right"></i>
        </div>
        <div className="p-4 flex justify-between items-center">
           <span className="w-full">
            <div className="flex  justify-between transition-all duration-300 ease-in-out">
              <p>Past Appointment</p>
            <button  onClick={()=>setopen(open ? false : true)}>{open ? <FaArrowCircleUp /> : <FaArrowAltCircleDown />}</button>
            </div>
      <div
  className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
    open ? 'max-h-96' : 'max-h-0'
  }`}>
  <div className="p-4 bg-gray-200">
    <table className="min-w-full text-left">
      <thead>
        <tr>
          <th className="px-2 py-1 border-2 border-black">Patient_name</th>
          <th className="px-2 py-1 border-2 border-black">Date</th>
          <th className="px-2 py-1 border-2 border-black">Time</th>
          {/* <th className="px-2 py-1 border-2 border-black">End_Time</th> */}
        </tr>
      </thead>
      <tbody>
        {PastAppointments.map((item,index) => (
          <tr key={index}>
            <td className="px-2 py-1 border">{item.name}</td>
            <td className="px-2 py-1 border"> {item.date.substring(0, 10)}</td>
            <td className="px-2 py-1 border">{item.start_time.slice(0,5)}</td>
            {/* <td className="px-2 py-1 border">{item.end_time}</td> */}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
          </span>
          <i className="fas fa-chevron-right"></i>
        </div>
      </div>
    </div>
  </div>
</div>



}
export default DoctorProfile;











































// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { useEffect, useState } from 'react';

// function DoctorProfile() {
//   const { doc_id } = useParams();
//   const [doctor, setDoctor] = useState([]);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get(`http://localhost:3000/api/doc_profile?doc_id=${doc_id}`);
//         if (res.data.success) {
//           // If API returns an array
//           setDoctor(res.data.data); 
//           console.log(res.data.data);
//         } else {
//           console.log("Error from try block");
//         }
//       } catch (error) {
//         console.log("Error from catch block", error);
//       }
//     };

//     fetchProfile();
//   }, [doc_id]);

//   return (
//     <div>
//       <h2>Welcome, Doctor {doctor.name || doc_id}</h2>
//       <p>ID: {doctor.doc_id}</p>
//       <p>Specialization: {doctor.specialization}</p>
//       <p>email: {doctor.email}</p>
//       <p>phone: {doctor.phone}</p>
//       {/* Add more fields as needed */}
//     </div>
//   );
// }

// export default DoctorProfile;











































// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { useEffect, useState } from 'react';

// function DoctorProfile() {
//   const { doc_id } = useParams();
//   const [doctor, setDoctor] = useState([]);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await axios.get(`http://localhost:3000/api/doc_profile?doc_id=${doc_id}`);
//         if (res.data.success) {
//           // If API returns an array
//           setDoctor(res.data.data); 
//           console.log(res.data.data);
//         } else {
//           console.log("Error from try block");
//         }
//       } catch (error) {
//         console.log("Error from catch block", error);
//       }
//     };

//     fetchProfile();
//   }, [doc_id]);

//   return (
//     <div>
//       <h2>Welcome, Doctor {doctor.name || doc_id}</h2>
//       <p>ID: {doctor.doc_id}</p>
//       <p>Specialization: {doctor.specialization}</p>
//       <p>email: {doctor.email}</p>
//       <p>phone: {doctor.phone}</p>
//       {/* Add more fields as needed */}
//     </div>
//   );
// }

// export default DoctorProfile;
