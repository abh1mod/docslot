import { useEffect ,useState} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowAltCircleDown } from "react-icons/fa"
import { FaArrowCircleUp } from "react-icons/fa";
import { useAuth } from "../ContextAPI/AuthContext";
import LoginDoc from "./LoginPages/LoginDoc";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import RemoveIcon from "../assets/remove.png";

function ConfirmDelete({onConfirm,onCancel}){
    return (<div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50" >
        <div>
            <div className="flex flex-col min-h-[300px] min-w-[360px] bg-white rounded-md p-6 shadow-sm  text-center items-center justify-center">
                <img src={RemoveIcon} alt="Remove Icon" className="w-20 h-23 mb-4"/>
                <h2 className="text-lg font-semibold mb-2">Are you sure?</h2>
                <p className="mb-4">Do You really want to Reject this appointment?</p>
                <div className="flex items-center justify-center w-full mb-1 mt-3 relative gap-5">
                    <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 " onClick={onConfirm} >
                        Reject
                    </button>
                    <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400" onClick={onCancel} >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>)
}

function DoctorProfile(){
  const {user, isLogin, setIsLogin} = useAuth();
  const navigate = useNavigate();
  //getting current date
  const today = new Date().toISOString().slice(0, 10); 
  const [aptToReject, setRejectId] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  // const{doc_id} = useParams();
  //logic for Accordion
  //for upcoming appointment
  const[isopen,setOpen]=useState(false);
  const[fetchdata,fetchData]=useState([])
  //for past appointment and we also use above useState
  const[open,setopen]=useState(false);

  const[edit,setEdit]=useState(false);


  // const[updatedata,setUpdatedata]=useState({

  // });
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
    },[user?.doc_id, aptToReject]);

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
                //  localStorage.setItem("user",JSON.stringify(res.data.data));
              }
              else{
                console.log("Error from try Block");
              }
            }catch(error){
              console.log("Error from catch Block");

            }
        }
    //fetch only doctor information
    // useEffect(()=>{
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

    const handleAptReject = async(apt_id) =>{
        try{
            const res = await axios.patch(`http://localhost:3000/api/doctor/reject_apt/${apt_id}`);
            if(res.data.success){
                toast.success("Appointment Rejected Successfully!",{
                  autoClose: 2000,
                 hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                })
                setShowConfirmation(false);
                setRejectId(null);
            }else{
                toast.error("Error while Rejecting Appointment!",{
                  autoClose: 2000,
                 hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                })
            }
        }catch(error){
            console.log(error);
            toast.error("Error while Action!",{
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
            const res = await axios.post("http://localhost:3000/api/doctor/logout");
            if(res.data.success){
                toast.success("Logout Successfully!",{
                  autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,

                })
                setIsLogin(false);
                navigate("/doc_home");
               
            }else{
                 toast.error("Error while Logout!",{
                  autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,

                })
            }
        }catch(error){
            toast.error("Error while Action!",{
                  autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,

                })
        }
    }



  if(!isLogin) return <LoginDoc/>
//simple html+tailwind
return <>
  <div className="bg-gray-100 p-6 min-h-[90vh] flex flex-col items-center ">
  <div className="bg-white p-3 min-h-[78vh] shadow-lg rounded-xl flex flex-col md:flex-row w-full max-w-4xl">
   
    {/* <div className="p-6 md:w-1/3 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-200">
      <img src={user?.image} alt="Doctor profile" className="rounded-full w-[145px] h-[145px] object-cover mb-4 mt-6" />
      <h2 className="text-xl font-semibold text-gray-800">{user?.name}</h2>
      <p className="text-gray-600 mb-4">{user?.specialization}</p>
      <div className="text-gray-600 space-y-2 text-sm">
        <p><i className="fas fa-phone mr-2"></i>{user?.phone}</p>
        <p><i className="fas fa-envelope mr-2"></i>{user?.email}</p>
        <p><i className="fas fa-map-marker-alt mr-2"></i>Boston, MA</p>
      </div>
       <button onClick={()=>setEdit(true)} className="hover:bg-gray-300 transition-all ease-in-out w-[6rem] h-[2.5rem] ml-16 mb-2 rounded-xl bg-gray-200 font-semibold text-gray-700 p-1">Edit Profile</button>
    </div> */}

   {/* {edit && <EditDoctor doctor={doctor} setDoctor={setDoctor} closeModal={handleclose} />} */}

 
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
        <button className="bg-blue-500 text-white rounded-lg flex items-center justify-center p-4">
          Manage Profile   
        </button>
        
      </div>
      <div className="bg-gray-100 rounded-lg divide-y divide-gray-00">
        <div className="p-4 flex justify-between items-center">
          <span className="w-full">
          <button
            onClick={() => {setopen(false), setOpen(isopen ? false : true) }}
            className="flex items-center justify-between w-full px-4 py-2 transition-all duration-300 ease-in-out"
          >
            <p className="text-left">Upcoming Appointment</p>
            {isopen ? <FaArrowCircleUp /> : <FaArrowAltCircleDown />}
          </button>

      <div
      //main upcoming appointement accordian

      //it can be implement in two ways here is one in backtick `` so that accordian can have 
      //transition be applied here on max-height class max-height apply on basis of isopen
  className={`overflow-hidden transition-all duration-500 ease-in-out ${
    isopen ? 'max-h-96' : 'max-h-0'
  }`}>
  <div className="pt-4">
  

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Patient Name
                </th>
                <th scope="col" class="px-6 py-3">
                    Date
                </th>
                <th scope="col" class="px-6 py-3">
                    Time
                </th>
                <th scope="col" class="px-6 py-3">
                    Status
                </th>
                <th scope="col" class="px-3 py-3">
                
                </th>

            </tr>
        </thead>
        <tbody>
          {upcomingAppointments.map((item, index) => (
            <tr key={index} class="odd:bg-white  even:bg-gray-50  border-b  border-gray-200">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {item.name || 'N/A'}
                </th>
                <td class="px-6 py-4">
                    {item.date.substring(0, 10) || 'N/A'}
                </td>
                <td class="px-6 py-4">
                    {(item?.start_time?.slice(0, 5) || '') }
                </td>
                {item.status === "Confirmed" ? (
                      <td class="px-6 py-4 font-semibold text-green-600">{item.status}</td>
                  ) : (
                        <td class="px-6 py-4 font-semibold text-red-600">{item.status}</td>
                ) }
                <td class="px-3 py-4">
                 <button
                                className="font-medium text-red-700 hover:underline"
                                title="Reject Appointment"
                                disabled={item.status === 'Rejected'}
                                onClick={() => {
                                setShowConfirmation(true);
                                setRejectId(item?.apt_id);
                                }}
                            >
                                x
                            </button>

                            {showConfirmation && (
                                <ConfirmDelete
                                onConfirm={() => {
                                    handleAptReject(aptToReject);
                                    setShowConfirmation(false);
                                    setRejectId(null);
                                }}
                                onCancel={() => {
                                    setShowConfirmation(false);
                                    setRejectId(null);
                                }}
                                />
                            )}

                  
                    {/* <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a> */}
                </td>
            </tr>
          ))}
          
              
        </tbody>
    </table>
</div>


  </div>
</div>

{/*same logic as upcoming appointment*/}
          </span>
          <i className="fas fa-chevron-right"></i>
        </div>
        <div className="p-4 flex justify-between items-center">
           <span className="w-full">

            <button
            onClick={() => {setOpen(false),setopen(open ? false : true)}}
            className="flex items-center justify-between w-full px-4 py-2 transition-all duration-300 ease-in-out"
          >
            <p className="text-left">Past Appointment</p>
            {open ? <FaArrowCircleUp /> : <FaArrowAltCircleDown />}
          </button>
   

      <div
  className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
    open ? 'max-h-96' : 'max-h-0'
  }`}>
  <div className="p-4 bg-gray-100">
<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Patient Name
                </th>
                <th scope="col" class="px-6 py-3">
                    Date
                </th>
                <th scope="col" class="px-6 py-3">
                    Time
                </th>
                <th scope="col" class="px-6 py-3">
                    Status
                </th>
                <th scope="col" class="px-3 py-3">
                    
                </th>
            </tr>
        </thead>
        <tbody>
          {PastAppointments.map((item, index) => (
            <tr key={index} class="odd:bg-white  even:bg-gray-50  border-b  border-gray-200">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {item.name || 'N/A'}
                </th>
                <td class="px-6 py-4">
                    {item.date.substring(0, 10) || 'N/A'}
                </td>
                <td class="px-6 py-4">
                    {(item?.start_time?.slice(0, 5) || '') }
                </td>
                <td class="px-6 py-4">
                    $2999
                </td>
                <td class="px-4 py-4">
                  
                    {/* <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a> */}
                </td>
            </tr>
          ))}
          
              
        </tbody>
    </table>
</div>
  </div>
</div>
          </span>
          <i className="fas fa-chevron-right"></i>
        </div>
      </div>
    </div>
  </div>
</div>
</>
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
