import { useEffect,useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import PtProfileEdit from "./PtProfileEdit";
function PtProfile(){
    const {pt_id} = useParams();
    const [pt_profile , setPatient] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [slot, setSlot] = useState([]);

    useEffect(()=>{
        const fetch_profile = async()=>{
            try{
                const res = await axios.get(`http://localhost:3000/api/pt_profile/${pt_id}`);
                if(res.data.success){
                    console.log("Profile Fetched Successfully",res.data.data);
                    setPatient(res.data.data);
                }
            }catch(error){
                console.log("Error From Catch Block",error);
            }
        }
        fetch_profile()
    }
    ,[isEditing,pt_id]);


    const fetchSlot = async()=>{
            try{
                const res = await axios.get(`http://localhost:3000/api/pt_slot/${pt_id}`);
                if(res.data.success){
                    setSlot(res.data.data);  
                }
            }catch(error){
                console.log("Error from catch Block",error);
            }
        }

    useEffect(()=>{
        fetchSlot();
    },[pt_id])

    const handleAptDelete = async(apt_id)=>{
        try{
            const res = await axios.delete(`http://localhost:3000/api/delete_apt/${apt_id}`);
            if(res.data.success){
                console.log("Appointment Deleted Successfully",res.data.data);
                fetchSlot();
            }
            else console.log("Error in Deleting Appointment")
        }catch(error){
            console.log("Error in deleting Appointment",error);
        }
    }

    return (
     <div className="flex flex-col items-center justify-center min-h-[90vh] bg-gray-100">
     
      <div className="flex gap-4 flex-col bg-white shadow-md rounded-lg p-9 min-w-[830px] max-w-md  min-h-[550px]">
        
        <div className="flex flex-col p-3 rounded-lg shadow-md border border-gray-200 bg-white">
          <div className="flex gap-9 items-center ">
            <img src="https://media.lordicon.com/icons/wired/gradient/17-avatar-man-nodding.gif" alt="Profile" className="w-24 h-24 rounded-full mb-4 ml-4 mr-4"/>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-gray-800 ">Profile <button onClick = {()=>{setIsEditing(true)}}className="font-medium text-sm text-blue-600 ">🔗Edit</button> </h1>
              <p className="text-lg font-semibold text-gray-800">👤 {pt_profile.name}</p>
              <p className="text-gray-600">☎︎  {pt_profile.phone}</p>  
              <p className="text-gray-600">📧 {pt_profile.email}</p>
              {isEditing && <PtProfileEdit pt_profile={pt_profile} setIsEditing={setIsEditing}/>}
            </div>
          </div>
          </div>

            <h1 className="text-2xl font-bold text-gray-800 mt-4">Scheduled Apppointments</h1>

            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-800">   
                    <tbody>
                    {slot.map((obj)=>(
                        <tr class="bg-white dark:bg-white-800 hover:bg-gray-50 dark:hover:bg-gray-100">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                Dr {obj.name}
                            </th>
                            <td class="px-6 py-4">
                                {obj.date.slice(0,10)}
                            </td>
                            <td class="px-6 py-4">
                                {obj.start_time.slice(0,5)}
                            </td>
                            {obj.status === "Confirmed" ? (
                                <td class="px-6 py-4 font-semibold text-green-600">{obj.status}</td>
                            ) : (
                                <td class="px-6 py-4 font-semibold text-red-600">{obj.status}</td>
                            ) }

                            <td class="px-6 py-4 text-right">
                                <button href="#" class="font-medium text-red-700 hover:underline" 
                                title="Delete Appointment" 
                                onClick={()=> handleAptDelete(obj.apt_id)}
                                >x</button>
                            </td>
                        </tr>

                    ))}
                        
                        
                    </tbody>
                </table>
            </div>
          </div>
        </div>

    
    )
}
export default PtProfile;