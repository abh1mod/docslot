import { useEffect, useState } from "react";
import DocCard from "./DocCard";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../ContextAPI/AuthContext";
import LoginPt from "./LoginPages/LoginPt";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { ImCross } from "react-icons/im";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

const Doctor=()=>{
    const {isLogin, user} = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter,setFilter]=useState(false);
    const [filterspec,setFilterspec]=useState("");
    
    const [down,setDown]=useState(false);
    const [search,setSearch]=useState("");

    const navigate = useNavigate();
  useEffect(() => {    
    const fetchDoctors = async () => {
      try {
        const result = await axios.get(`${BASE_URL}/api/fetch_all`);
       console.log(result);
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

    
  const handleFilterclose=()=>{
    setFilterspec("");
  }


// The problem is: setSearch(e) is asynchronous — 
// so search still holds the previous value when you immediately check search.length.
  const handleFilter=(e)=>{
    setDown(true);
    setSearch(e);
    if(e.length>0) setFilter(true);
    else setFilter(false);
    // setDown(!down)
    // setFilterspec("")
  }

  const handleFilterspec=(event)=>{
    setFilterspec(event);
    setSearch("");
    setDown(false);
    setFilter(false);
    // setDown(!down)
  }

  const handledown=()=>{
    setDown(true);
  }
 
   console.log(search)

  // console.log(filterspec)

  const Specialization=["Gastroenterology","Neurologist","Cardiologist","Surgeon","Dermatology"]
 
    if (!isLogin) return <LoginPt/>
 
  //for only showing in search of filter that user type
   const filteredSearch = filter
  ? Specialization.filter((item) =>
      item.toLowerCase().includes(search.toLowerCase())
    )
  : Specialization;



    //no use of useeffect as when we set filter it will render page and accordingly cards will be shown
    const filteredDoctors = filterspec
  ? doctors.filter((item) =>
      item.specialization?.toLowerCase() === filterspec.toLowerCase()
    )
  : doctors;

  // const shouldShowDropdown = search.length >= 0 && !filterspec;
  
     return <div className="flex flex-row-reverse justify-between gap-2 bg-white-100 min-h-screen p-4">

     <div  className=" relative flex flex-row  gap-5">
        {filterspec.length>0 ? <div onClick={handleFilterclose} className="bg-gray-500 cursor-pointer h-fit p-1 text-white font-bold rounded-md flex flex-row items-center gap-1"><ImCross/> {filterspec}</div> :<div></div>}
        {/* <button onClick={handleFilter} id="dropdown-button" className=" flex flex-row items-center gap-2 justify-center w-full px-4 py-2 text-sm font-medium h-fit text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
          <span className="m-1 text-md font-bold">Specialization </span>
          {down ? <IoIosArrowUp/> : <IoIosArrowDown/> }
        </button> */}
        <input 
        value={search}
         onChange={(e)=>handleFilter(e.target.value)}
         onClick={handledown}
         className="w-full border-1 rounded-md border-black h-fit p-1" placeholder="Specialization"></input>
        <div
  id="dropdown-menu"
  className={`${down ? 'absolute right-0 top-10 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1' : 'hidden'}`}>
  {/* Dropdown content */}

  {
  
  filteredSearch.map((event, index) => (
         <a key={index} onClick={(e)=>handleFilterspec(event)} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md">
    {event}
  </a>
   ))
  
 
  }
</div>
      </div>

    <ul className="p-4 space-y-4">
  {loading ? (
    <Loading />
  ) : (
    (filterspec ? filteredDoctors : doctors).map((event, index) => (
      <li key={index}>
        <Link to={`/booking/${event.doc_id}`} className="no-underline text-black">
          <DocCard events={event} />
        </Link>
      </li>
    ))
  )}
</ul>

    </div>
    
}

export default Doctor;