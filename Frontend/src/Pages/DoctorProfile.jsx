import { useEffect ,useState} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowAltCircleDown } from "react-icons/fa"
import { FaArrowCircleUp } from "react-icons/fa";
import EditDoctor from "../Modal/EditDoctor";

// import { Userdata } from "../ContextApi/Context"; 
// import { useContext } from "react";


function DoctorProfile(){
  
  //getting current date
  const today = new Date().toISOString().slice(0, 10); 
  // const { loged, setLoged } = useContext(Userdata);

   const{doc_id} = useParams();
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
            try{
              
              const res = await axios.get(`http://localhost:3000/api/my_day/${doc_id}`);
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
    },[doc_id]);

 console.log(fetchdata)
    const[doctor, setDoctor] = useState({});


   const fetchProfile = async()=>{
            try{
              const res = await axios.get(`http://localhost:3000/api/doc_profile/${doc_id}`);
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
    useEffect(()=>{
        fetchProfile();

    },[doc_id,edit]);
  //  const{name,specialization,phone,email,id,image,about_us}=doctor
   
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

const handleclose=()=>{
  setEdit(false);
}

useEffect(() => {
  console.log("Doctor state updated:", doctor);
}, [doctor]);

//simple html+tailwind
return <>
  <div className="bg-gray-100 min-h-screen flex flex-col items-center ">
  <div className="bg-white shadow-lg rounded-xl flex flex-col md:flex-row w-full max-w-4xl">
   
    <div className="p-6  flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-200">
      <img src={doctor.image} alt="Doctor profile" className="rounded-full w-24 h-24 object-cover mb-4" />
      <h2 className="text-xl font-semibold text-gray-800">{doctor.name}</h2>
      <p className="text-gray-600 mb-4">{doctor.specialization}</p>
      <div className="text-gray-600 space-y-2 text-sm">
        <p><i className="fas fa-phone mr-2"></i>{doctor.phone}</p>
        <p><i className="fas fa-envelope mr-2"></i>{doctor.email}</p>
        <p><i className="fas fa-map-marker-alt mr-2"></i>Boston, MA</p>
      </div>
       <button onClick={()=>setEdit(true)} className="hover:bg-gray-300 transition-all ease-in-out w-[6rem] h-[2.5rem] ml-16 mb-2 rounded-xl bg-gray-200 font-semibold text-gray-700 p-1">Edit Profile</button>
    </div>

   {edit && <EditDoctor doctor={doctor} setDoctor={setDoctor} closeModal={handleclose} />}

 
    <div className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-4">Doctor Dashboard</h1>
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
  className={`overflow-hidden transition-all duration-500 ease-in-out ${
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
            <td className="px-2 py-1 border">{item.name || 'N/A'}</td>
            <td className="px-2 py-1 border"> {item.date.substring(0, 10) || 'N/A'}</td>
            <td className="px-2 py-1 border"> {(item?.start_time?.slice(0, 5) || '') }</td>
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
            <td className="px-2 py-1 border">{item.name || 'N/A'}</td>
            <td className="px-2 py-1 border"> {item.date.substring(0, 10) || 'N/A'}</td>
            <td className="px-2 py-1 border"> {(item?.start_time?.slice(0, 5) || '')}</td>
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
</>
}
export default DoctorProfile;