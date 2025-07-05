import { NavLink } from "react-router-dom";
import './Header.css'
import { useState,useEffect } from "react";
import { Userdata } from "../ContextApi/Context"; 
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useContext } from "react";
import {AuthContext} from "../ContextApi/AuthContext"
import axios from "axios";
import { toast } from 'react-toastify';

const Header=()=>{

  const [navbarRole, setNavbarRole] = useState("");

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    if (storedRole) {
      setNavbarRole(storedRole);
    }
  }, []);
 

  
   const {isLogin,role,user,setUser,setIsLogin}=useContext(AuthContext);
   const { loged, logout } = useContext(Userdata);
    const navigate=useNavigate();


   const handleLogout = async() =>{
        try{
            const res = await axios.post("http://localhost:3000/api/patient/logout");
            if(res.data.success){
                alert(res.data.message);
                setIsLogin(false);
                setUser(null);
                console.log(role)
                toast.success("Logout Successfully!",{
                  autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,

                })
                {role=="doctor" || user?.role==="doctor" ?  navigate("/doc_home") : navigate("/home")}
                // window.location.reload(true);
            }else{
                alert(res.data.message);
            }
        }catch(error){
            console.log(error);
        }
    }
   
    // parsing the data from localstorage as it holds only string data type
    // const user=JSON.parse(localStorage.getItem("user"))

    return <>
        <nav className="bg-white shadow-lg fixed w-full z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        

        <div className="flex-shrink-0 text-2xl font-bold text-blue-600">
        <NavLink to = "/">DocSlot</NavLink>
        </div>

     
        <div className="hidden md:flex space-x-6">
         <NavLink
          to={navbarRole === "doctor" || user?.role === "doctor" ? "/doc_home" : "/home"}
          className="nav-link text-gray-700 hover:text-blue-600 font-medium">Home</NavLink>

          <NavLink to='/about' className="nav-link text-gray-700 hover:text-blue-600 font-medium">About</NavLink>
            
          {navbarRole==="doctor" || user?.role==="doctor" ? <Link to="/doc_profile"><button>DocDashboard</button></Link> :
          <div className="flex flex-row gap-4">
          <NavLink to='/doctor' className="nav-link text-gray-700 hover:text-blue-600 font-medium">BookAppointment</NavLink>  
          
          {isLogin ?
           <div className="flex flex-row gap-3">
           <NavLink to="/pt_profile" className=" text-gray-700 hover:text-blue-600 font-medium">Dashboard</NavLink>
           <NavLink onClick={handleLogout}>Logout</NavLink> 
           </div>:
          <div>
          <NavLink to="/pt_profile" className=" text-gray-700 hover:text-blue-600 font-medium">Login</NavLink>
          </div>
          }
          
          </div>
          }
          

          
        </div>

    
        <div className="md:hidden">
          <button  className="text-gray-700 hover:text-blue-600 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                 viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

 
    <div id="mobileMenu" className="md:hidden hidden px-4 pb-4 space-y-2">
      <NavLink to='/' className="block text-gray-700 hover:text-blue-600 font-medium">Home</NavLink>
      <NavLink to='/about' className="block text-gray-700 hover:text-blue-600 font-medium">About</NavLink>
      <NavLink to='/doctor' className="block text-gray-700 hover:text-blue-600 font-medium">Doctor</NavLink>
    </div>
  </nav>
    </>
}
export default Header;