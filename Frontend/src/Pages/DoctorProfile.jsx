import { useEffect ,useState} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function DoctorProfile(){
  const{doc_id} = useParams();
    const[doctor, setDoctor] = useState({});

    useEffect(()=>{
        const fetchProfile = async()=>{
            try{
              const res = await axios.get(`http://localhost:3000/api/doc_profile/${doc_id}`);
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

    },[]);

    return <div>
      <h1>{doctor.name}</h1>
      <p>{doctor.doc_id}</p> 
      <p>{doctor.specialization}</p> 
      <p>{doctor.phone}</p> 
      <p>{doctor.email}</p> 
      <p>{doctor.about_us}</p>
      <img src={doctor.image} style={{width:"300px"}}/>

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
