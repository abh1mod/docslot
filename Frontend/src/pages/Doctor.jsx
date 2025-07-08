import { useEffect, useState } from "react";
import DocCard from "./DocCard";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../ContextApi/AuthContext";
import LoginPt from "./LoginPages/LoginPt";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

const Doctor=()=>{
    const {isLogin, user} = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  useEffect(() => {    
    const fetchDoctors = async () => {
      try {
        const result = await axios.get(`${BASE_URL}/api/fetch_all`);

        if (result.data.success) {
          setDoctors(result.data.data);
        } else {
          console.error('Error fetching doctors:', result.message);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };  
    fetchDoctors();
  }, [isLogin]);
 
    if (!isLogin) return <LoginPt/>
  
     return <div className="bg-white-100 min-h-screen p-4">
      <ul className="p-4 space-y-4">
  {loading ? (
    <Loading/>
  ):(
    doctors.map((event, index) => (
        <li key={index}>
        <Link to={`/booking/${event.doc_id}`} className="no-underline text-black" >
        
          <DocCard events={event} />
    
        
        </Link>
      </li>
  
    ))
  )}

</ul>
    </div>
    
}

export default Doctor;