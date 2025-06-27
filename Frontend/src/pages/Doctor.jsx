import { useEffect, useState } from "react";
import DocCard from "./DocCard";
import Loading from "./Loading";
import { Link } from "react-router-dom";
const Doctor=()=>{

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/fetch_all');
        const result = await response.json();

        if (result.data.length>0) {
          setDoctors(result.data);
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
  
  }, []);
    return<div className="bg-white-100 min-h-screen p-4">
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